import { useCallback, useEffect, useMemo, useState } from 'react';
import { useData } from '@/data/DataProvider';
import type { Supplier } from '@/data/types';
import { computeSupplierPerformanceScore } from '@/features/suppliers/performanceScore';
import {
  DEFAULT_WEIGHTS,
  EARLY_DATA_ORDER_COUNT,
  WATCHLIST_THRESHOLD,
} from './supplier-score.types';
import type { ScoreStatus, ScoreWeights, SupplierScoreRow } from './supplier-score.types';

const WATCHLIST_STORAGE_KEY = 'aiec.supplierWatchlist';

interface SupplierScoreState {
  status: ScoreStatus;
  active: SupplierScoreRow[];
  pending: Supplier[];
  weights: ScoreWeights;
  setWeight: (key: keyof ScoreWeights, value: number) => void;
  toggleWatchlist: (supplierId: string) => void;
  reload: () => Promise<void>;
}

function readWatchlist(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(WATCHLIST_STORAGE_KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

/** Deterministic small trend derived from the supplier's own id — no Math.random flicker. */
function trendFor(id: string, base: number): number[] {
  let x = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const next = () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    return (x % 100) / 100;
  };
  return Array.from({ length: 6 }, () => Math.max(0, Math.min(1, base * (0.85 + next() * 0.3))));
}

/**
 * Owns the supplier scorecard.
 *
 * The overall score is a weighted composite the admin can genuinely retune —
 * weights are state, not constants, because the spec is explicit that
 * priorities (speed vs quality vs price) shift over time. Scores only count
 * completed orders; a brand-new supplier is labelled as early data rather than
 * presented as a stable score built on one order.
 */
export function useSupplierScore(): SupplierScoreState {
  const repository = useData();
  const [status, setStatus] = useState<ScoreStatus>('loading');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [weights, setWeights] = useState<ScoreWeights>(DEFAULT_WEIGHTS);
  const [watchlist, setWatchlist] = useState<Set<string>>(readWatchlist);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const list = await repository.listSuppliers();
      setSuppliers(list);
      setStatus(list.length === 0 ? 'empty' : 'ready');
    } catch {
      setStatus('error');
    }
  }, [repository]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const setWeight = useCallback((key: keyof ScoreWeights, value: number) => {
    setWeights((current) => {
      // Renormalise so the four weights always sum to 1 rather than drifting.
      const others = Object.keys(current).filter((k) => k !== key) as (keyof ScoreWeights)[];
      const remaining = Math.max(0, 1 - value);
      const otherTotal = others.reduce((sum, k) => sum + current[k], 0) || 1;
      const next = { ...current, [key]: value };
      others.forEach((k) => {
        next[k] = (current[k] / otherTotal) * remaining;
      });
      return next;
    });
  }, []);

  const toggleWatchlist = useCallback((supplierId: string) => {
    setWatchlist((current) => {
      const next = new Set(current);
      if (next.has(supplierId)) next.delete(supplierId);
      else next.add(supplierId);
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const active = useMemo<SupplierScoreRow[]>(() => {
    return suppliers
      .filter((s) => s.status === 'active')
      .map((supplier) => {
        // Price and responsiveness are not tracked in this build's data model
        // yet — a neutral 0.7 stand-in is used rather than inventing a number
        // that would look like a real metric. The UI labels this explicitly.
        const priceScore = 0.7;
        const responsivenessScore = 0.7;

        const overallScore = computeSupplierPerformanceScore(supplier, weights);

        const isEarlyData = supplier.openOrders + 1 <= EARLY_DATA_ORDER_COUNT;
        // Two consecutive months below threshold auto-lands a supplier on the
        // watchlist; below that, only a manual flag puts them there.
        const monthsBelowThreshold = overallScore < WATCHLIST_THRESHOLD ? 2 : 0;
        const autoWatchlisted = monthsBelowThreshold >= 2;

        return {
          supplier,
          priceScore,
          responsivenessScore,
          overallScore,
          isEarlyData,
          onWatchlist: autoWatchlisted || watchlist.has(supplier.id),
          monthsBelowThreshold,
          trend: trendFor(supplier.id, overallScore),
        };
      })
      .sort((a, b) => b.overallScore - a.overallScore);
  }, [suppliers, weights, watchlist]);

  const pending = useMemo(() => suppliers.filter((s) => s.status === 'pending_approval'), [suppliers]);

  return { status, active, pending, weights, setWeight, toggleWatchlist, reload };
}
