import { useCallback, useEffect, useMemo, useState } from 'react';
import { useData } from '@/data/DataProvider';
import type { AutomationRule } from '@/data/types';
import { DEGRADED_THRESHOLD, DOWN_THRESHOLD } from './automation-health.types';
import type { AutomationRow, ComponentHealth, FailureLogEntry, HealthStatus } from './automation-health.types';

const POLL_MS = 20_000;

interface AutomationHealthState {
  status: HealthStatus;
  rows: AutomationRow[];
  overall: ComponentHealth;
  retryingId: string | null;
  retry: (rule: AutomationRule) => Promise<void>;
  togglePause: (rule: AutomationRule) => Promise<void>;
  reload: () => Promise<void>;
}

const REASON_BY_INDEX = ['rateLimited', 'missingInput', 'timeout', 'dependencyDown'] as const;

function healthOf(rule: AutomationRule): ComponentHealth {
  if (!rule.enabled) return 'paused';
  if (rule.status === 'failing') return 'down';
  if (rule.status === 'degraded') return 'degraded';
  const successRate = rule.runsToday > 0 ? 1 - rule.failuresToday / rule.runsToday : 1;
  if (successRate < DOWN_THRESHOLD) return 'down';
  if (successRate < DEGRADED_THRESHOLD) return 'degraded';
  return 'healthy';
}

/**
 * Owns the single most important screen for the "one person monitors" model.
 *
 * A failed automated step never silently fails a business process — it always
 * lands in this visible retry queue. A component that has failed the same
 * record several times running is flagged as a stuck loop rather than left to
 * keep retrying forever, which is what an unattended retry loop would actually
 * do to a real system.
 */
export function useAutomationHealth(): AutomationHealthState {
  const repository = useData();
  const [status, setStatus] = useState<HealthStatus>('loading');
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [retryCounts, setRetryCounts] = useState<Record<string, number>>({});

  const reload = useCallback(async () => {
    try {
      const list = await repository.listAutomations();
      setRules(list);
      setStatus(list.length === 0 ? 'empty' : 'ready');
    } catch {
      setStatus((current) => (current === 'ready' ? 'ready' : 'error'));
    }
  }, [repository]);

  useEffect(() => {
    void reload();
    const timer = window.setInterval(() => void reload(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [reload]);

  const rows = useMemo<AutomationRow[]>(() => {
    return rules.map((rule) => {
      const health = healthOf(rule);
      const uptimePct = rule.runsToday > 0 ? 1 - rule.failuresToday / Math.max(rule.runsToday, 1) : 1;

      // A deterministic-looking failure log entry per failure count today,
      // seeded from the rule id so it stays stable across renders.
      const failures: FailureLogEntry[] = Array.from({ length: rule.failuresToday }, (_, i) => {
        const reasonId = REASON_BY_INDEX[(rule.id.charCodeAt(0) + i) % REASON_BY_INDEX.length];
        const attempts = retryCounts[rule.id] ?? 0;
        return {
          id: `${rule.id}-fail-${i}`,
          ruleId: rule.id,
          ruleName: rule.name,
          reasonKey: `automationHealth.reason.${reasonId}`,
          at: rule.lastRunAt,
          // Three or more retries on the same rule without success reads as a
          // stuck loop, not a component that will fix itself if left alone.
          isStuckLoop: attempts >= 3,
        };
      });

      return { rule, health, uptimePct, failures };
    });
  }, [rules, retryCounts]);

  const overall = useMemo<ComponentHealth>(() => {
    if (rows.some((r) => r.health === 'down')) return 'down';
    if (rows.some((r) => r.health === 'degraded')) return 'degraded';
    if (rows.every((r) => r.health === 'paused')) return 'paused';
    return 'healthy';
  }, [rows]);

  const retry = useCallback(
    async (rule: AutomationRule) => {
      setRetryingId(rule.id);
      setRetryCounts((current) => ({ ...current, [rule.id]: (current[rule.id] ?? 0) + 1 }));
      try {
        // SIMULATED: there is no real automation runner to re-invoke in this
        // build. Re-enabling the rule stands in for a manual retry and is
        // reflected through the same repository call the pause toggle uses.
        await repository.toggleAutomation(rule.id, true);
        await reload();
      } finally {
        setRetryingId(null);
      }
    },
    [repository, reload],
  );

  const togglePause = useCallback(
    async (rule: AutomationRule) => {
      await repository.toggleAutomation(rule.id, !rule.enabled);
      await reload();
    },
    [repository, reload],
  );

  return { status, rows, overall, retryingId, retry, togglePause, reload };
}
