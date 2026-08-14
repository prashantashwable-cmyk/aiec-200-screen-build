import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '@/data/DataProvider';
import { haversineKm } from '@/design-system';
import { CHECKIN_RADIUS_METRES, HIGH_RISK_STEP_IDS } from './track-technician.types';
import type {
  AnomalyFinding,
  CrewMember,
  TechTrackData,
  TechTrackStatus,
} from './track-technician.types';

interface TrackTechnicianState {
  status: TechTrackStatus;
  data: TechTrackData | null;
  reload: () => Promise<void>;
}

const POLL_MS = 20_000;

/**
 * Owns one technician's current installation.
 *
 * The anomaly list is the point of this screen. Each finding is a specific
 * condition an admin would otherwise only catch by reading every timestamp —
 * and the one that matters most, a checkout with safety steps still open, is
 * raised as critical so it cannot be scrolled past.
 */
export function useTrackTechnician(): TrackTechnicianState {
  const { userId } = useParams<{ userId: string }>();
  const repository = useData();

  const [status, setStatus] = useState<TechTrackStatus>('loading');
  const [data, setData] = useState<TechTrackData | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setStatus('notFound');
      return;
    }
    try {
      const technician = await repository.getUser(userId);
      if (!technician || technician.role !== 'technician') {
        setStatus('notFound');
        return;
      }

      const [jobs, users] = await Promise.all([repository.listJobs(), repository.listUsers()]);

      // The live job is the one they are assigned to that is not finished.
      const job =
        jobs.find((j) => j.technicianId === userId && j.status !== 'completed') ?? null;

      if (!job) {
        setData({
          technician,
          job: null,
          crew: [],
          steps: [],
          currentStep: null,
          completedSteps: 0,
          evidenceCount: 0,
          checkInAt: null,
          checkOutAt: null,
          hoursOnSite: null,
          distanceFromSiteMetres: null,
          minutesSincePing: technician.lastSeenAt
            ? Math.floor((Date.now() - new Date(technician.lastSeenAt).getTime()) / 60_000)
            : -1,
          anomalies: [],
        });
        setStatus('noJob');
        return;
      }

      const distanceMetres = technician.location
        ? Math.round(haversineKm(technician.location, job.location) * 1000)
        : null;

      const minutesSincePing = technician.lastSeenAt
        ? Math.floor((Date.now() - new Date(technician.lastSeenAt).getTime()) / 60_000)
        : -1;

      // Everyone assigned to this site, so a multi-technician job reads as one
      // job rather than several disconnected screens.
      const crew: CrewMember[] = jobs
        .filter((j) => j.dealId === job.dealId && j.technicianId)
        .map((j) => users.find((u) => u.id === j.technicianId))
        .filter((u): u is NonNullable<typeof u> => Boolean(u))
        .filter((u, index, list) => list.findIndex((x) => x.id === u.id) === index)
        .map((user) => {
          const gap = user.location
            ? Math.round(haversineKm(user.location, job.location) * 1000)
            : null;
          return {
            user,
            checkedIn: gap !== null && gap <= CHECKIN_RADIUS_METRES,
            distanceMetres: gap,
            minutesSincePing: user.lastSeenAt
              ? Math.floor((Date.now() - new Date(user.lastSeenAt).getTime()) / 60_000)
              : -1,
          };
        });

      const completedSteps = job.steps.filter((s) => s.status === 'complete').length;
      const currentStep = job.steps.find((s) => s.status === 'current') ?? null;
      const evidenceCount = job.steps.reduce((sum, s) => sum + s.evidenceCount, 0);

      const checkInAt = job.startedAt ?? null;
      const checkOutAt = job.completedAt ?? null;
      const hoursOnSite = checkInAt
        ? Math.round(
            ((checkOutAt ? new Date(checkOutAt).getTime() : Date.now()) -
              new Date(checkInAt).getTime()) /
              360_000,
          ) / 10
        : null;

      const anomalies: AnomalyFinding[] = [];

      if (checkInAt && distanceMetres !== null && distanceMetres > CHECKIN_RADIUS_METRES) {
        // Two different problems share this shape, and which one it is depends
        // on whether a high-risk step is open right now.
        const onHighRiskStep = currentStep !== null && HIGH_RISK_STEP_IDS.includes(currentStep.id);
        if (onHighRiskStep) {
          anomalies.push({
            id: 'leftDuringCriticalStep',
            severity: 'critical',
            context: `${job.code} · ${distanceMetres} m`,
          });
        } else {
          anomalies.push({
            id: 'checkInOutOfRange',
            severity: 'high',
            context: `${job.code} · ${distanceMetres} m`,
          });
        }
      }

      // A visit today that the schedule does not know about.
      const scheduledToday =
        new Date(job.scheduledFor).toDateString() === new Date().toDateString();
      if (checkInAt && !scheduledToday && job.status === 'in_progress') {
        anomalies.push({
          id: 'unscheduledCheckIn',
          severity: 'medium',
          context: job.code,
        });
      }

      if (checkOutAt && completedSteps < job.steps.length) {
        anomalies.push({
          id: 'checkoutIncomplete',
          severity: 'critical',
          context: `${job.code} · ${job.steps.length - completedSteps}`,
        });
      }

      const blocked = job.steps.find(
        (s) => s.requiresEvidence && s.status === 'current' && s.evidenceCount === 0,
      );
      if (blocked) {
        anomalies.push({ id: 'blockedStepNoEvidence', severity: 'high', context: job.code });
      }

      if (minutesSincePing >= 20 && job.status === 'in_progress') {
        anomalies.push({
          id: 'signalLost',
          severity: 'medium',
          context: String(minutesSincePing),
        });
      }

      setData({
        technician,
        job,
        crew,
        steps: job.steps,
        currentStep,
        completedSteps,
        evidenceCount,
        checkInAt,
        checkOutAt,
        hoursOnSite,
        distanceFromSiteMetres: distanceMetres,
        minutesSincePing,
        anomalies,
      });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [userId, repository]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  return { status, data, reload: load };
}
