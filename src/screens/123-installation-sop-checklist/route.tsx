import type { ScreenRoute } from '@/navigation/registry';
import { InstallationSopChecklistView } from './InstallationSopChecklistView';

const route: ScreenRoute = {
  id: '123',
  path: '/technician/jobs/:jobId/sop',
  roles: ['technician'],
  titleKey: 'installSop.title',
  Component: InstallationSopChecklistView,
  tab: 'jobs',
};

export default route;
