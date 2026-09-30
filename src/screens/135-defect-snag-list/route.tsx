import type { ScreenRoute } from '@/navigation/registry';
import { SnagListScreen } from './SnagListView';

const route: ScreenRoute = {
  id: '135',
  path: '/snags/:jobId?',
  roles: ['technician', 'admin'],
  titleKey: 'snagList.title',
  Component: SnagListScreen,
  tab: { admin: 'map', technician: 'jobs' },
};

export default route;
