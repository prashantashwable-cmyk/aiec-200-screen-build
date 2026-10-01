import type { TrainingModule, TrainingProgress, TrainingRole } from './types';

/**
 * The seeded curriculum (151). Sixteen modules across four topics, role-aware: some are for everyone, some only for the role whose work they
 * describe. The three safety modules a technician must finish before being put on a job carry `gatesJobAssignment`. Two modules have a second
 * version, so the library can show a partner what changed.
 */
const ALL: TrainingRole[] = ['surveyor', 'technician', 'supplier'];
const FIELD: TrainingRole[] = ['surveyor', 'technician'];
const v1 = [{ version: 1, effectiveFrom: '2026-01-01', minVersion: 1 }];

const m = (id: string, topic: TrainingModule['topic'], order: number, requiredFor: TrainingRole[], relevantFor: TrainingRole[], dependsOn: string[], minutes: number, lessons: number, offlineKb: number, extra: Partial<TrainingModule> = {}): TrainingModule => ({
  id: `tm-${id}`, code: id.toUpperCase(), topic, order, requiredFor, relevantFor: [...new Set([...requiredFor, ...relevantFor])], dependsOn: dependsOn.map((d) => `tm-${d}`), gatesJobAssignment: false, minutes, lessons, offlineKb, versions: v1, status: 'published', isDemo: true, ...extra,
});

export const seedTrainingModules: TrainingModule[] = [
  m('onb-01', 'onboarding', 1, ALL, ALL, [], 15, 4, 1800),
  m('onb-02', 'onboarding', 2, FIELD, ALL, ['onb-01'], 20, 5, 2600),
  m('onb-03', 'onboarding', 3, ['supplier'], [], ['onb-01'], 20, 5, 2400),
  m('saf-01', 'safety', 1, FIELD, ['supplier'], [], 30, 6, 4200, { gatesJobAssignment: true }),
  m('saf-02', 'safety', 2, ['technician'], [], ['saf-01'], 40, 7, 6800, { gatesJobAssignment: true, versions: [...v1, { version: 2, effectiveFrom: '2026-08-15', minVersion: 1, changeKey: 'change2' }] }),
  m('saf-03', 'safety', 3, ['technician'], [], ['saf-01'], 35, 6, 5200, { gatesJobAssignment: true }),
  m('saf-04', 'safety', 4, ['technician'], ['surveyor'], ['saf-01'], 25, 5, 3600),
  m('saf-05', 'safety', 5, ['supplier'], [], ['onb-01'], 25, 5, 3000),
  m('cus-01', 'customer', 1, FIELD, ['supplier'], ['onb-01'], 20, 4, 2200),
  m('cus-02', 'customer', 2, ['surveyor'], [], ['cus-01'], 30, 6, 4000),
  m('cus-03', 'customer', 3, ['technician'], [], ['cus-01', 'prd-03'], 20, 4, 2600),
  m('prd-01', 'product', 1, FIELD, ['supplier'], ['onb-01'], 35, 7, 5600),
  m('prd-02', 'product', 2, ['surveyor'], [], ['prd-01'], 30, 6, 4400),
  m('prd-03', 'product', 3, ['technician'], [], ['saf-02', 'saf-03', 'prd-01'], 60, 10, 9800, { versions: [...v1, { version: 2, effectiveFrom: '2026-09-10', minVersion: 1, changeKey: 'change2' }] }),
  m('prd-04', 'product', 4, [], ['technician'], ['prd-03'], 30, 6, 4800),
  m('prd-05', 'product', 5, ['supplier'], [], ['prd-01'], 30, 6, 4200),
];

const ts = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString();
const done = (userId: string, code: string, daysAgo: number, version = 1): TrainingProgress => {
  const mod = seedTrainingModules.find((x) => x.code === code.toUpperCase()) as TrainingModule;
  return { userId, moduleId: mod.id, status: 'completed', startedAt: ts(daysAgo + 2), completedAt: ts(daysAgo), version, lessonsDone: mod.lessons };
};
const doing = (userId: string, code: string, daysAgo: number, lessonsDone: number): TrainingProgress => ({ userId, moduleId: `tm-${code}`, status: 'in_progress', startedAt: ts(daysAgo), version: 1, lessonsDone });

const techFull = (id: string, base: number, v2 = 2): TrainingProgress[] => [
  done(id, 'onb-01', base + 40), done(id, 'onb-02', base + 38), done(id, 'saf-01', base + 35), done(id, 'saf-02', base + 30, v2), done(id, 'saf-03', base + 28), done(id, 'saf-04', base + 25),
  done(id, 'cus-01', base + 22), done(id, 'prd-01', base + 20), done(id, 'prd-03', base + 15, v2), done(id, 'cus-03', base + 10),
];
const surveyorFull = (id: string, base: number): TrainingProgress[] => [done(id, 'onb-01', base + 30), done(id, 'onb-02', base + 28), done(id, 'saf-01', base + 26), done(id, 'cus-01', base + 22), done(id, 'cus-02', base + 18), done(id, 'prd-01', base + 14), done(id, 'prd-02', base + 10)];

export const seedTrainingProgress: TrainingProgress[] = [
  // Technicians. Santosh finished safety before the hoistway module was revised (still counts, shown as updated); Ajay has not finished the safety modules yet, so he cannot be put on a new job.
  ...techFull('u-tech-1', 3, 1),
  ...techFull('u-tech-2', 1),
  ...techFull('u-tech-5', 5),
  done('u-tech-3', 'onb-01', 30), done('u-tech-3', 'onb-02', 28), done('u-tech-3', 'saf-01', 20), doing('u-tech-3', 'saf-02', 3, 3),
  // Surveyors.
  ...surveyorFull('u-srv-1', 4),
  done('u-srv-2', 'onb-01', 25), done('u-srv-2', 'onb-02', 24), done('u-srv-2', 'saf-01', 20), doing('u-srv-2', 'cus-01', 2, 2),
  done('u-srv-3', 'onb-01', 12),
  // Suppliers.
  done('u-sup-1', 'onb-01', 200), done('u-sup-1', 'onb-03', 198), done('u-sup-1', 'saf-05', 190), done('u-sup-1', 'prd-01', 185), done('u-sup-1', 'prd-05', 180),
];
