import type { ScreenRoute } from '@/navigation/registry';
import { QcElectricalScreen } from './QcElectricalView';

const route: ScreenRoute = {
  id: '133',
  path: '/qc-electrical/:jobId?',
  roles: ['technician', 'admin'],
  titleKey: 'qcElec.title',
  Component: QcElectricalScreen,
  tab: { admin: 'map', technician: 'jobs' },
};

export default route;
