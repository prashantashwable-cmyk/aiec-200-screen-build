/** Screen 123 — Installation SOP Checklist. Types and translation keys only. */

import type { InstallSopPhase } from '@/data/types';

export type SopStatus = 'loading' | 'ready' | 'error' | 'not_found';

/** How often the checklist re-reads while open. */
export const POLL_MS = 20_000;
/** Where changes not yet sent live on the phone. Per person, so a shared phone never mixes two technicians' work. */
export const queueKey = (userId: string) => `aiec.sopQueue.${userId}`;

export const PHASES: InstallSopPhase[] = ['preparation', 'rails', 'machine', 'car', 'wiring', 'safety', 'final'];
export const STEP_IDS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'] as const;
export const SLOT_IDS = ['shaft', 'pit', 'alignment', 'mount', 'frame', 'sensors', 'panel', 'earthing', 'governor', 'buffers', 'gear', 'alarm', 'ard', 'load', 'final'] as const;
export const PROBLEMS = ['depends_on', 'evidence_missing', 'materials_not_confirmed', 'not_started', 'not_yours', 'read_only'] as const;
/** Errors that mean the action itself was refused: retrying will not change the answer, so it is reported, not retried. */
export const FINAL_ERRORS = [
  'depends_on', 'evidence_missing', 'materials_not_confirmed', 'already_done', 'not_yours', 'forbidden', 'not_found', 'read_only', 'job_on_hold', 'not_started', 'invalid_state',
  'not_allowed', 'not_scheduled_yet', 'safety_step_applies', 'reason_required', 'photo_too_large', 'captured_in_future', 'captured_before_job', 'captured_invalid',
] as const;

export const jobPath = (id: string) => `/technician/jobs/${id}`;
export const homePath = '/technician';

const rec = <T extends string>(ns: string, keys: readonly T[]) => Object.fromEntries(keys.map((k) => [k, `${ns}.${k}`])) as Record<T, string>;

export const SOP_KEYS = {
  title: 'installSop.title',
  loading: 'installSop.loading',
  back: 'installSop.back',
  error: { title: 'installSop.error.title', body: 'installSop.error.body' },
  notFound: { title: 'installSop.notFound.title', body: 'installSop.notFound.body' },
  phase: rec('installSop.phase', PHASES),
  hint: rec('installSop.hint', STEP_IDS),
  slot: rec('installSop.slot', SLOT_IDS),
  sync: {
    offline: 'installSop.sync.offline',
    queued: 'installSop.sync.queued',
    syncing: 'installSop.sync.syncing',
    storage: 'installSop.sync.storage',
    pending: 'installSop.sync.pending',
  },
  failed: { title: 'installSop.failed.title', item: 'installSop.failed.item', dismiss: 'installSop.failed.dismiss' },
  start: {
    heading: 'installSop.start.heading',
    body: 'installSop.start.body',
    button: 'installSop.start.button',
    materials: 'installSop.start.materials',
    hold: 'installSop.start.hold',
    early: 'installSop.start.early',
    openJob: 'installSop.start.openJob',
    assistant: 'installSop.start.assistant',
  },
  rail: { heading: 'installSop.rail.heading', progress: 'installSop.rail.progress', version: 'installSop.rail.version', tap: 'installSop.rail.tap' },
  step: {
    safety: 'installSop.step.safety',
    photoRequired: 'installSop.step.photoRequired',
    noPhotoNeeded: 'installSop.step.noPhotoNeeded',
    done: 'installSop.step.done',
    doneBy: 'installSop.step.doneBy',
    naDone: 'installSop.step.naDone',
    notYours: 'installSop.step.notYours',
    legacy: 'installSop.step.legacy',
    waiting: 'installSop.step.waiting',
    missing: 'installSop.step.missing',
    delivery: 'installSop.step.delivery',
    deliveryWaiting: 'installSop.step.deliveryWaiting',
    next: 'installSop.step.next',
    focusIt: 'installSop.step.focusIt',
    focusHint: 'installSop.step.focusHint',
    complete: 'installSop.step.complete',
    na: 'installSop.step.na',
    notApplicableHere: 'installSop.step.notApplicableHere',
    pending: 'installSop.step.pending',
    upcoming: 'installSop.step.upcoming',
    blocked: 'installSop.step.blocked',
    readOnly: 'installSop.step.readOnly',
  },
  photo: {
    required: 'installSop.photo.required',
    optional: 'installSop.photo.optional',
    take: 'installSop.photo.take',
    retake: 'installSop.photo.retake',
    taken: 'installSop.photo.taken',
    none: 'installSop.photo.none',
    waiting: 'installSop.photo.waiting',
    at: 'installSop.photo.at',
    unreadable: 'installSop.photo.unreadable',
  },
  na: {
    title: 'installSop.na.title',
    intro: 'installSop.na.intro',
    introConfig: 'installSop.na.introConfig',
    reason: 'installSop.na.reason',
    hint: 'installSop.na.hint',
    confirm: 'installSop.na.confirm',
  },
  finished: { title: 'installSop.finished.title', body: 'installSop.finished.body', local: 'installSop.finished.local' },
  toast: { started: 'installSop.toast.started' },
  problem: rec('installSop.problem', [...FINAL_ERRORS, 'generic'] as const),
} as const;
