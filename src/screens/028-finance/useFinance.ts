import { useCallback, useEffect, useMemo, useState } from 'react';
import { useData } from '@/data/DataProvider';
import type { Payment } from '@/data/types';
import { OUTLIER_MULTIPLE } from './finance.types';
import type { AgingBucket, AgingGroup, FinanceStatus, FinanceSummary, UpcomingOutflow } from './finance.types';

type WindowId = '7' | '30';

interface FinanceState {
  status: FinanceStatus;
  summary: FinanceSummary | null;
  agingGroups: AgingGroup[];
  upcoming: UpcomingOutflow[];
  window: WindowId;
  setWindow: (window: WindowId) => void;
  reload: () => Promise<void>;
}

/** Which aging bucket a receivable falls into, from its own due date — not the
 *  deal's close date, since a multi-stage plan has several individual dates. */
function bucketFor(payment: Payment, now: number): AgingBucket {
  const daysOverdue = Math.floor((now - new Date(payment.dueDate).getTime()) / 86_400_000);
  if (payment.status === 'failed') return 'disputed';
  if (daysOverdue <= 0) return 'current';
  if (daysOverdue <= 30) return 'd30';
  if (daysOverdue <= 60) return 'd60';
  return 'd90plus';
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Owns the financial overview.
 *
 * This is a deliberate read-only reflection of the Payments module — every
 * figure here is derived from the same `Payment` records rather than a second,
 * separately maintained number, which is the reconciliation guarantee the spec
 * asks for.
 */
export function useFinance(): FinanceState {
  const repository = useData();
  const [status, setStatus] = useState<FinanceStatus>('loading');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [window, setWindow] = useState<WindowId>('30');

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const list = await repository.listPayments();
      setPayments(list);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [repository]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const now = Date.now();

  const outstanding = useMemo(
    () => payments.filter((p) => p.status === 'due' || p.status === 'pending' || p.status === 'overdue'),
    [payments],
  );

  const agingGroups = useMemo<AgingGroup[]>(() => {
    const buckets: Record<AgingBucket, Payment[]> = {
      current: [],
      d30: [],
      d60: [],
      d90plus: [],
      disputed: [],
    };
    for (const payment of outstanding) {
      buckets[bucketFor(payment, now)].push(payment);
    }
    return (Object.keys(buckets) as AgingBucket[]).map((bucket) => ({
      bucket,
      payments: buckets[bucket],
      total: buckets[bucket].reduce((sum, p) => sum + p.amount, 0),
    }));
  }, [outstanding, now]);

  const upcoming = useMemo<UpcomingOutflow[]>(() => {
    const days = Number(window);
    const cutoff = now + days * 86_400_000;
    return payments
      .filter((p) => p.status === 'due' || p.status === 'pending')
      .filter((p) => new Date(p.dueDate).getTime() <= cutoff)
      .map((p) => ({
        payment: p,
        daysUntilDue: Math.ceil((new Date(p.dueDate).getTime() - now) / 86_400_000),
      }))
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }, [payments, window, now]);

  const summary = useMemo<FinanceSummary | null>(() => {
    if (status !== 'ready') return null;
    const cashIn = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    // Supplier and payout outflows are not separately modelled in this build's
    // data yet, so cashOut reflects what is actually tracked: retention held
    // and refunds. Documented here rather than inventing a second figure.
    const cashOut = payments
      .filter((p) => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0);

    const amounts = outstanding.map((p) => p.amount);
    const med = median(amounts);
    const totalReceivable = amounts.reduce((sum, v) => sum + v, 0);
    const skewedByOutlier = amounts.some((v) => med > 0 && v >= med * OUTLIER_MULTIPLE);

    return {
      cashIn,
      cashOut,
      netPosition: cashIn - cashOut,
      totalReceivable,
      medianReceivable: med,
      skewedByOutlier,
    };
  }, [status, payments, outstanding]);

  return { status, summary, agingGroups, upcoming, window, setWindow, reload };
}
