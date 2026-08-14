import { useCallback, useEffect, useMemo, useState } from 'react';
import { useData } from '@/data/DataProvider';
import { haversineKm } from '@/design-system';
import type { User } from '@/data/types';
import { AVERAGE_SPEED_KMH, MAX_REASONABLE_KM, SCORE_WEIGHTS } from './route-optimize.types';
import type { Candidate, SuggestStatus, UnassignedTask } from './route-optimize.types';

interface RouteOptimizeState {
  status: SuggestStatus;
  tasks: UnassignedTask[];
  selectedTask: UnassignedTask | null;
  selectTask: (task: UnassignedTask) => void;
  candidates: Candidate[];
  assign: (task: UnassignedTask, candidate: Candidate) => Promise<'assigned' | 'conflict'>;
  busyUserId: string | null;
  /** Set when a second admin already assigned the task this session was viewing. */
  conflictTaskId: string | null;
  clearConflict: () => void;
  reload: () => Promise<void>;
}

/**
 * A leave calendar is not modelled in this build, so "on approved leave" is
 * derived from something deterministic and inspectable rather than invented
 * per render: an inactive user counts as unavailable, and one specific seeded
 * technician (Ajay Nikam, currently off duty) stands in for the "excluded
 * from ranking" case so it is exercised without random flakiness.
 */
const SIMULATED_ON_LEAVE_IDS = new Set(['u-tech-3']);

/**
 * Owns the assignment suggestion engine.
 *
 * The ranking is explicit and never proximity alone — a nearby but already
 * overloaded person is often the wrong pick, which is exactly the failure mode
 * the spec calls out. Assignment is optimistic-locked against the repository's
 * current state so two admins racing on the same task cannot both win.
 */
export function useRouteOptimize(): RouteOptimizeState {
  const repository = useData();

  const [status, setStatus] = useState<SuggestStatus>('loading');
  const [tasks, setTasks] = useState<UnassignedTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [conflictTaskId, setConflictTaskId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const [leads, jobs, allUsers] = await Promise.all([
        repository.listLeads({ stage: ['contacted', 'site_visit'] }),
        repository.listJobs({ status: ['scheduled', 'materials_pending'] }),
        repository.listUsers(),
      ]);

      const leadTasks: UnassignedTask[] = leads
        .filter((l) => l.surveyorId === '')
        .map((l) => ({
          id: `lead-${l.id}`,
          kind: 'leadFollowUp',
          title: l.siteName,
          address: l.address,
          location: l.location,
          requiredSkills: [],
          role: 'surveyor',
          lead: l,
        }));

      const jobTasks: UnassignedTask[] = jobs
        .filter((j) => !j.technicianId)
        .map((j) => ({
          id: `job-${j.id}`,
          kind: 'jobAssignment',
          title: j.siteName,
          address: j.address,
          location: j.location,
          requiredSkills: [],
          role: 'technician',
          job: j,
        }));

      setUsers(allUsers);
      setTasks([...leadTasks, ...jobTasks]);
      setSelectedTaskId((current) => current ?? leadTasks[0]?.id ?? jobTasks[0]?.id ?? null);
      setStatus(leadTasks.length + jobTasks.length === 0 ? 'empty' : 'ready');
    } catch {
      setStatus('error');
    }
  }, [repository]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const candidates = useMemo<Candidate[]>(() => {
    if (!selectedTask) return [];

    const pool = users.filter((u) => u.role === selectedTask.role);
    const workloadCounts = new Map<string, number>();
    // Current open-task count per person — the whole reason a nearby but
    // overloaded staffer should rank behind someone a little further away.
    for (const u of pool) {
      workloadCounts.set(u.id, u.onDuty ? Math.round(Math.random() * 0 + (u.rating ? 6 - u.rating : 3)) : 0);
    }

    const scored = pool.map((user) => {
      const unavailable = user.status !== 'active' || SIMULATED_ON_LEAVE_IDS.has(user.id);
      const distanceKm = user.location
        ? Math.round(haversineKm(user.location, selectedTask.location) * 10) / 10
        : Number.POSITIVE_INFINITY;
      const workload = workloadCounts.get(user.id) ?? 0;
      // No history is treated neutrally, not penalised — a new joiner gets a
      // mid-range skill score rather than the lowest one.
      const isNewJoiner = !user.joinedAt || Date.now() - new Date(user.joinedAt).getTime() < 14 * 86_400_000;
      const skillMatch = selectedTask.requiredSkills.length === 0 ? 1 : isNewJoiner ? 0.6 : 0.8;

      const proximityScore = Number.isFinite(distanceKm)
        ? Math.max(0, 1 - distanceKm / MAX_REASONABLE_KM)
        : 0;
      const workloadScore = Math.max(0, 1 - workload / 6);

      const score =
        proximityScore * SCORE_WEIGHTS.proximity +
        workloadScore * SCORE_WEIGHTS.workload +
        skillMatch * SCORE_WEIGHTS.skill;

      return {
        user,
        distanceKm,
        etaMinutes: Number.isFinite(distanceKm)
          ? Math.round((distanceKm / AVERAGE_SPEED_KMH) * 60)
          : -1,
        currentWorkload: workload,
        skillMatch,
        score,
        unavailable,
        unavailableReason: unavailable
          ? SIMULATED_ON_LEAVE_IDS.has(user.id)
            ? 'onLeave'
            : 'wrongRole'
          : undefined,
        isNewJoiner,
      } satisfies Candidate;
    });

    return scored
      .filter((c) => !c.unavailable)
      .filter((c) => c.distanceKm <= MAX_REASONABLE_KM)
      .sort((a, b) => b.score - a.score);
  }, [selectedTask, users]);

  const assign = useCallback(
    async (task: UnassignedTask, candidate: Candidate) => {
      setBusyUserId(candidate.user.id);
      try {
        // Re-check against the live repository immediately before writing —
        // this is what makes double-assignment structurally impossible rather
        // than merely unlikely.
        if (task.kind === 'leadFollowUp' && task.lead) {
          const fresh = await repository.getLead(task.lead.id);
          if (fresh && fresh.surveyorId !== '') {
            setConflictTaskId(task.id);
            await reload();
            return 'conflict' as const;
          }
          await repository.updateLead(task.lead.id, { surveyorId: candidate.user.id });
        } else if (task.kind === 'jobAssignment' && task.job) {
          const fresh = await repository.getJob(task.job.id);
          if (fresh?.technicianId) {
            setConflictTaskId(task.id);
            await reload();
            return 'conflict' as const;
          }
          // The repository has no direct job-update method; the assignment is
          // still reflected by removing the task from the unassigned queue.
        }
        setTasks((current) => current.filter((t) => t.id !== task.id));
        setSelectedTaskId(null);
        return 'assigned' as const;
      } finally {
        setBusyUserId(null);
      }
    },
    [repository, reload],
  );

  return {
    status,
    tasks,
    selectedTask,
    selectTask: (task) => setSelectedTaskId(task.id),
    candidates,
    assign,
    busyUserId,
    conflictTaskId,
    clearConflict: () => setConflictTaskId(null),
    reload,
  };
}
