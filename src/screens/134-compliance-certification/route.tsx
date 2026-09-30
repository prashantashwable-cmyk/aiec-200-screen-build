import type { ScreenRoute } from '@/navigation/registry';
import { ComplianceScreen } from './ComplianceView';

const route: ScreenRoute = {
  id: '134',
  path: '/compliance/:jobId?',
  roles: ['technician', 'admin'],
  titleKey: 'compliance.title',
  Component: ComplianceScreen,
  tab: { admin: 'map', technician: 'jobs' },
};

export default route;
