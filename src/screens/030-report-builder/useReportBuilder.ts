import { useCallback, useEffect, useMemo, useState } from 'react';
import { useData } from '@/data/DataProvider';
import type { Deal, Lead, Payment, Supplier, User } from '@/data/types';
import { SAVED_REPORTS_KEY, isCompatible } from './report-builder.types';
import type { BuilderStatus, DimensionId, MetricId, RangePreset, ReportRow, SavedReport } from './report-builder.types';

interface ReportBuilderState {
  status: BuilderStatus;
  metric: MetricId;
  setMetric: (m: MetricId) => void;
  dimension: DimensionId;
  setDimension: (d: DimensionId) => void;
  range: RangePreset;
  setRange: (r: RangePreset) => void;
  compatible: boolean;
  rows: ReportRow[];
  saved: SavedReport[];
  saveCurrent: (name: string) => void;
  loadSaved: (report: SavedReport) => void;
  deleteSaved: (id: string) => void;
  setSchedule: (id: string, frequency: SavedReport['scheduleFrequency']) => void;
  exportCsv: () => void;
  reload: () => Promise<void>;
}

function csvEscape(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function readSaved(): SavedReport[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_REPORTS_KEY) ?? '[]') as SavedReport[];
  } catch {
    return [];
  }
}

/** Rolls forward correctly every time it runs — never frozen to creation date. */
function rangeStart(range: RangePreset, now: number): number {
  if (range === 'last7') return now - 7 * 86_400_000;
  if (range === 'last90') return now - 90 * 86_400_000;
  if (range === 'thisMonth') {
    const d = new Date(now);
    return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  }
  return now - 30 * 86_400_000;
}

/**
 * Owns ad hoc reporting.
 *
 * Every metric here is computed from the exact same repository calls the
 * standard dashboards use, so a custom report can never show a number that
 * contradicts them — there is no second aggregation path.
 */
export function useReportBuilder(): ReportBuilderState {
  const repository = useData();
  const [status, setStatus] = useState<BuilderStatus>('loading');
  const [metric, setMetric] = useState<MetricId>('leadCount');
  const [dimension, setDimension] = useState<DimensionId>('stage');
  const [range, setRange] = useState<RangePreset>('last30');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [saved, setSaved] = useState<SavedReport[]>(readSaved);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const [leadList, dealList, paymentList, userList, supplierList] = await Promise.all([
        repository.listLeads(),
        repository.listDeals(),
        repository.listPayments(),
        repository.listUsers(),
        repository.listSuppliers(),
      ]);
      setLeads(leadList);
      setDeals(dealList);
      setPayments(paymentList);
      setUsers(userList);
      setSuppliers(supplierList);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [repository]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const compatible = isCompatible(metric, dimension);

  const rows = useMemo<ReportRow[]>(() => {
    if (!compatible) return [];
    const now = Date.now();
    const start = rangeStart(range, now);
    const inRange = leads.filter((l) => new Date(l.createdAt).getTime() >= start);

    const groupKey = (lead: Lead): string => {
      if (dimension === 'stage') return lead.stage;
      if (dimension === 'surveyor') return users.find((u) => u.id === lead.surveyorId)?.name ?? lead.surveyorId;
      if (dimension === 'city') return lead.city;
      if (dimension === 'month') return lead.createdAt.slice(0, 7);
      // 'supplier' dimension slices deals, not leads directly.
      const deal = deals.find((d) => d.leadId === lead.id);
      return suppliers.find((s) => s.id === deal?.supplierId)?.name ?? 'Unknown';
    };

    const groups = new Map<string, Lead[]>();
    for (const lead of inRange) {
      const key = groupKey(lead);
      groups.set(key, [...(groups.get(key) ?? []), lead]);
    }

    return [...groups.entries()]
      .map(([key, groupLeads]) => {
        const groupDeals = groupLeads
          .map((l) => deals.find((d) => d.leadId === l.id))
          .filter((d): d is Deal => Boolean(d));
        const won = groupDeals.filter((d) => d.status === 'won');

        let value: number;
        if (metric === 'leadCount') value = groupLeads.length;
        else if (metric === 'dealCount') value = won.length;
        else if (metric === 'revenue') value = won.reduce((sum, d) => sum + d.agreedPrice, 0);
        else if (metric === 'conversionRate') {
          const closed = groupLeads.filter((l) => l.stage === 'won' || l.stage === 'lost').length;
          value = closed > 0 ? won.length / closed : 0;
        } else if (metric === 'avgDealSize') {
          value = won.length ? won.reduce((sum, d) => sum + d.agreedPrice, 0) / won.length : 0;
        } else {
          const dealIds = new Set(groupDeals.map((d) => d.id));
          value = payments
            .filter((p) => p.status === 'overdue' && dealIds.has(p.dealId))
            .reduce((sum, p) => sum + p.amount, 0);
        }

        return { dimensionValue: key, value: Math.round(value * 100) / 100 };
      })
      .sort((a, b) => b.value - a.value);
  }, [compatible, leads, deals, payments, users, suppliers, dimension, metric, range]);

  const saveCurrent = useCallback(
    (name: string) => {
      const report: SavedReport = {
        id: `rep-${Date.now()}`,
        name,
        metric,
        dimension,
        range,
        scheduleFrequency: 'none',
      };
      setSaved((current) => {
        const next = [report, ...current];
        localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(next));
        return next;
      });
    },
    [metric, dimension, range],
  );

  const loadSaved = useCallback((report: SavedReport) => {
    setMetric(report.metric);
    setDimension(report.dimension);
    setRange(report.range);
  }, []);

  const deleteSaved = useCallback((id: string) => {
    setSaved((current) => {
      const next = current.filter((r) => r.id !== id);
      localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setSchedule = useCallback((id: string, frequency: SavedReport['scheduleFrequency']) => {
    setSaved((current) => {
      const next = current.map((r) => (r.id === id ? { ...r, scheduleFrequency: frequency } : r));
      localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const exportCsv = useCallback(() => {
    const csvRows = [['Dimension', 'Value'], ...rows.map((r) => [r.dimensionValue, String(r.value)])];
    const csv = csvRows.map((row) => row.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aiec-report-${metric}-by-${dimension}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [rows, metric, dimension]);

  return {
    status,
    metric,
    setMetric,
    dimension,
    setDimension,
    range,
    setRange,
    compatible,
    rows,
    saved,
    saveCurrent,
    loadSaved,
    deleteSaved,
    setSchedule,
    exportCsv,
    reload,
  };
}
