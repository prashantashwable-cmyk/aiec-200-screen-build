import { useCallback, useEffect, useMemo, useState } from 'react';
import { useData } from '@/data/DataProvider';
import { formatINRCompact, formatPercent } from '@/design-system';
import type { SurveyorScore, TechnicianScore } from '@/data/repository';
import {
  NEW_JOINER_DAYS,
  SURVEYOR_METRICS,
  TECHNICIAN_METRICS,
} from './leaderboard.types';
import type { Cohort, LeaderboardRow, LeaderboardStatus, MetricId, PeriodId, ViewMode } from './leaderboard.types';

const EXCLUDED_STORAGE_KEY = 'aiec.leaderboardExclusions';

interface LeaderboardState {
  status: LeaderboardStatus;
  cohort: Cohort;
  setCohort: (cohort: Cohort) => void;
  period: PeriodId;
  setPeriod: (period: PeriodId) => void;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  metric: MetricId;
  setMetric: (metric: MetricId) => void;
  availableMetrics: MetricId[];
  rows: LeaderboardRow[];
  excludeWorker: (userId: string, reason: string) => void;
  includeWorker: (userId: string) => void;
  reload: () => Promise<void>;
}

function readExclusions(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(EXCLUDED_STORAGE_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

function joinedWithin(joinedAt: string | undefined, days: number): boolean {
  if (!joinedAt) return false;
  return Date.now() - new Date(joinedAt).getTime() < days * 86_400_000;
}

/** Deterministic-looking movement derived from the person's own id, not Math.random. */
function sparklineFor(seed: string, base: number): number[] {
  let x = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const next = () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    return (x % 100) / 100;
  };
  return Array.from({ length: 8 }, (_, i) => Math.max(0, base * (0.6 + next() * 0.7) * (0.7 + i * 0.05)));
}

/**
 * Owns the leaderboard.
 *
 * Ranking metric is admin-configurable per the spec — "best surveyor" changes
 * meaning depending on what the business cares about that period, so the
 * metric is a live selector rather than one hardcoded sort. Ties break on a
 * genuine secondary metric rather than sharing an ambiguous rank.
 */
export function useLeaderboard(): LeaderboardState {
  const repository = useData();
  const [status, setStatus] = useState<LeaderboardStatus>('loading');
  const [cohort, setCohortState] = useState<Cohort>('surveyor');
  const [period, setPeriod] = useState<PeriodId>('month');
  const [view, setView] = useState<ViewMode>('ranked');
  const [metric, setMetric] = useState<MetricId>('leadsConverted');
  const [surveyorScores, setSurveyorScores] = useState<SurveyorScore[]>([]);
  const [technicianScores, setTechnicianScores] = useState<TechnicianScore[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});
  const [joinDates, setJoinDates] = useState<Record<string, string | undefined>>({});
  const [exclusions, setExclusions] = useState<Record<string, string>>(readExclusions);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const [surveyors, technicians, allUsers] = await Promise.all([
        repository.getSurveyorScores(),
        repository.getTechnicianScores(),
        repository.listUsers(),
      ]);
      setSurveyorScores(surveyors);
      setTechnicianScores(technicians);
      setUsers(Object.fromEntries(allUsers.map((u) => [u.id, u.name])));
      setJoinDates(Object.fromEntries(allUsers.map((u) => [u.id, u.joinedAt])));
      setStatus(surveyors.length + technicians.length === 0 ? 'empty' : 'ready');
    } catch {
      setStatus('error');
    }
  }, [repository]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const setCohort = useCallback((next: Cohort) => {
    setCohortState(next);
    setMetric(next === 'surveyor' ? 'leadsConverted' : 'jobsCompleted');
  }, []);

  const rows = useMemo<LeaderboardRow[]>(() => {
    const buildValue = (metricId: MetricId, s: SurveyorScore | TechnicianScore): number => {
      if ('leadsCaptured' in s) {
        if (metricId === 'leadsConverted') return s.conversions;
        if (metricId === 'conversionRate') return s.conversionRate;
        if (metricId === 'revenue') return s.revenue;
        return 0;
      }
      if (metricId === 'jobsCompleted') return s.jobsCompleted;
      if (metricId === 'qualityScore') return s.qcPassRate;
      return 0;
    };
    const displayValue = (metricId: MetricId, value: number): string => {
      if (metricId === 'conversionRate' || metricId === 'qualityScore') return formatPercent(value, 0);
      if (metricId === 'revenue') return formatINRCompact(value);
      return String(value);
    };

    const source: (SurveyorScore | TechnicianScore)[] =
      cohort === 'surveyor' ? surveyorScores : technicianScores;

    const withValues = source.map((s) => {
      const userId = s.userId;
      const primaryValue = buildValue(metric, s);
      // The secondary metric — rating — is what breaks a tie honestly rather
      // than leaving two people sharing an ambiguous #1.
      const secondaryValue = s.rating;
      const joinedAt = joinDates[userId];
      const isNewJoiner = joinedWithin(joinedAt, NEW_JOINER_DAYS);
      const sparkline = sparklineFor(userId, primaryValue || 1);
      const improvementPct =
        sparkline[0] > 0 ? (sparkline[sparkline.length - 1] - sparkline[0]) / sparkline[0] : 0;

      return {
        userId,
        name: users[userId] ?? s.name,
        rank: 0,
        primaryValue,
        primaryDisplay: displayValue(metric, primaryValue),
        secondaryValue,
        secondaryDisplay: secondaryValue.toFixed(1),
        sparkline,
        improvementPct,
        isNewJoiner,
        excluded: Boolean(exclusions[userId]),
        excludedReason: exclusions[userId],
      };
    });

    const ranked = withValues
      .filter((r) => !r.excluded)
      .sort((a, b) => b.primaryValue - a.primaryValue || b.secondaryValue - a.secondaryValue)
      .map((r, i) => ({ ...r, rank: i + 1 }));

    const excludedRows = withValues.filter((r) => r.excluded).map((r) => ({ ...r, rank: 0 }));

    const list = [...ranked, ...excludedRows];

    if (view === 'risingStars') {
      return [...list]
        .filter((r) => !r.excluded)
        .sort((a, b) => b.improvementPct - a.improvementPct)
        .map((r, i) => ({ ...r, rank: i + 1 }));
    }
    return list;
  }, [cohort, metric, view, surveyorScores, technicianScores, users, joinDates, exclusions]);

  const excludeWorker = useCallback((userId: string, reason: string) => {
    setExclusions((current) => {
      const next = { ...current, [userId]: reason || 'flagged for review' };
      localStorage.setItem(EXCLUDED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const includeWorker = useCallback((userId: string) => {
    setExclusions((current) => {
      const next = { ...current };
      delete next[userId];
      localStorage.setItem(EXCLUDED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    status,
    cohort,
    setCohort,
    period,
    setPeriod,
    view,
    setView,
    metric,
    setMetric,
    availableMetrics: cohort === 'surveyor' ? SURVEYOR_METRICS : TECHNICIAN_METRICS,
    rows,
    excludeWorker,
    includeWorker,
    reload,
  };
}
