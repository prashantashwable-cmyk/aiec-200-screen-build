import type { ScreenRoute } from '@/navigation/registry';
import { MaterialUsageView } from './MaterialUsageView';

const route: ScreenRoute = {
  id: '128',
  path: '/material-usage/:jobId?',
  roles: ['technician', 'admin'],
  titleKey: 'materialLog.title',
  Component: MaterialUsageView,
  tab: { admin: 'map', technician: 'jobs' },
};

export default route;
