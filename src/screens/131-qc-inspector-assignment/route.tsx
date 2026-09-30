import type { ScreenRoute } from '@/navigation/registry';
import { QcAssignmentScreen } from './QcAssignmentView';

const route: ScreenRoute = {
  id: '131',
  path: '/qc-assignments/:jobId?',
  roles: ['technician', 'admin'],
  titleKey: 'qcAssignment.title',
  Component: QcAssignmentScreen,
  tab: { admin: 'map', technician: 'jobs' },
};

export default route;
