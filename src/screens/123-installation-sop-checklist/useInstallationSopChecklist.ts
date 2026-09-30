import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '@/data/DataProvider';
import { useSession } from '@/session/SessionProvider';
import type { InstallationSopView } from '@/data/repository';
import { applyQueue, shrinkPhoto } from '@/features/technician/sopQueue';
import type { LocalSop, SopQueueInput, SopQueueItem } from '@/features/technician/sopQueue';
import type { SopStatus } from './installation-sop-checklist.types';
import { FINAL_ERRORS, POLL_MS, queueKey } from './installation-sop-checklist.types';

export interface FailedChange {
  id: string;
  stepId: string | null;
  code: string;
}

export interface ActionResult {
  ok: boolean;
  code?: string;
}

const isFinal = (code: string) => (FINAL_ERRORS as readonly string[]).includes(code);
const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

function readQueue(key: string): SopQueueItem[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as SopQueueItem[]) : [];
  } catch {
    return [];
  }
}

export type InstallationSopState = ReturnType<typeof useInstallationSopChecklist>;

/**
 * Owns one job's checklist. Every change is written down on the phone first, with the moment it was done, then sent in order when the
 * network allows: the screen shows it as done at once and marks it "not synced", so the technician's physical progress never waits on
 * a connection. A change the server refuses (a step done out of order, a photo not there) is reported, never silently lost.
 */
export function useInstallationSopChecklist() {
  const repository = useData();
  const { user } = useSession();
  const { jobId } = useParams();
  const key = user ? queueKey(user.id) : '';
  const [status, setStatus] = useState<SopStatus>('loading');
  const [server, setServer] = useState<InstallationSopView | null>(null);
  const [queue, setQueue] = useState<SopQueueItem[]>(() => (key ? readQueue(key) : []));
  const [failed, setFailed] = useState<FailedChange[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageFull, setStorageFull] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const flushing = useRef(false);
  const queueRef = useRef<SopQueueItem[]>(queue);
  queueRef.current = queue;

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const persist = useCallback(
    (next: SopQueueItem[]) => {
      queueRef.current = next;
      setQueue(next);
      if (!key) return;
      try {
        if (next.length === 0) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(next));
        setStorageFull(false);
      } catch {
        // The phone's storage is full: the work is still held in this session, but it would not survive closing the app.
        setStorageFull(true);
      }
    },
    [key],
  );

  const load = useCallback(async () => {
    if (!user || !jobId || !navigator.onLine) return;
    try {
      setServer(await repository.getInstallationSop(jobId, user.id));
      setStatus('ready');
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      if (code === 'not_found' || code === 'forbidden') setStatus('not_found');
      else setStatus((current) => (current === 'ready' ? 'ready' : 'error'));
    }
  }, [repository, user, jobId]);

  /** Sends what is waiting, oldest first. An answer of "no" is reported and dropped; anything else is kept and tried again. */
  const flush = useCallback(async () => {
    if (!user || flushing.current || !navigator.onLine || queueRef.current.length === 0) return;
    flushing.current = true;
    setSyncing(true);
    try {
      for (const item of [...queueRef.current]) {
        try {
          if (item.kind === 'start') await repository.startInstallation(item.jobId, user.id, item.capturedAt);
          else if (item.kind === 'photo') await repository.attachStepEvidence(item.jobId, item.stepId, item.slotId, { fileName: item.fileName, previewUrl: item.previewUrl, capturedAt: item.capturedAt }, user.id);
          else if (item.kind === 'complete') await repository.completeSopStep(item.jobId, item.stepId, user.id, item.capturedAt);
          else if (item.kind === 'na') await repository.markStepNotApplicable(item.jobId, item.stepId, item.reason, user.id, item.capturedAt);
          else await repository.focusSopStep(item.jobId, item.stepId, user.id);
          persist(queueRef.current.filter((q) => q.id !== item.id));
        } catch (e) {
          const code = e instanceof Error ? e.message : 'generic';
          if (!isFinal(code)) break;
          persist(queueRef.current.filter((q) => q.id !== item.id));
          // A focus that no longer fits is not worth alarming anyone over; everything else is.
          if (item.kind !== 'focus') setFailed((f) => [...f, { id: item.id, stepId: 'stepId' in item ? item.stepId : null, code }]);
        }
      }
    } finally {
      flushing.current = false;
      setSyncing(false);
      await load();
    }
  }, [repository, user, persist, load]);

  useEffect(() => {
    setStatus('loading');
    void load().then(() => flush());
    const poll = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(poll);
  }, [load, flush]);
  // Back online: send what was done while away, then catch up.
  useEffect(() => {
    if (isOnline) void flush();
  }, [isOnline, flush]);
  const reload = () => {
    setStatus('loading');
    void load();
  };

  const enqueue = useCallback(
    (item: SopQueueInput) => {
      if (!jobId) return;
      const full = { ...item, id: newId(), jobId, capturedAt: new Date().toISOString() } as SopQueueItem;
      persist([...queueRef.current, full]);
      void flush();
    },
    [jobId, persist, flush],
  );

  const local: LocalSop | null = useMemo(() => (server ? applyQueue(server, queue, user?.name ?? '') : null), [server, queue, user?.name]);
  const view = local?.view ?? null;
  const currentId = view?.currentStepId ?? null;
  const shownId = selected && view?.steps.some((s) => s.id === selected) ? selected : currentId;

  const start = () => enqueue({ kind: 'start' });
  const complete = (stepId: string) => enqueue({ kind: 'complete', stepId });
  const markNa = (stepId: string, reason: string) => enqueue({ kind: 'na', stepId, reason });
  const focus = (stepId: string) => {
    enqueue({ kind: 'focus', stepId });
    setSelected(stepId);
  };
  /** Takes the photo down to a size a phone can keep, then queues it. Returns false when the file could not be read as a picture. */
  const photo = async (stepId: string, slotId: string, file: File): Promise<boolean> => {
    if (!file.type.startsWith('image/')) return false;
    try {
      const previewUrl = await shrinkPhoto(file);
      enqueue({ kind: 'photo', stepId, slotId, fileName: file.name, previewUrl });
      return true;
    } catch {
      return false;
    }
  };

  return {
    status,
    reload,
    view,
    local,
    queue: queue.filter((q) => q.jobId === jobId),
    queuedAll: queue.length,
    failed,
    dismissFailed: () => setFailed([]),
    syncing,
    isOnline,
    storageFull,
    selectedId: shownId,
    select: setSelected,
    start,
    complete,
    markNa,
    focus,
    photo,
  };
}
