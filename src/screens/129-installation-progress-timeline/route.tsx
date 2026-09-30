import type { ScreenRoute } from '@/navigation/registry';
import { InstallTimelineScreen } from './InstallTimelineView';

const route: ScreenRoute = {
  id: '129',
  path: '/installation-timeline/:jobId?',
  roles: ['technician', 'admin', 'customer'],
  titleKey: 'installTimeline.title',
  Component: InstallTimelineScreen,
  tab: { admin: 'map', technician: 'jobs', customer: 'installation' },
};

export default route;
