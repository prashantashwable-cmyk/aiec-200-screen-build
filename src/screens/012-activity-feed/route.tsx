import type { ScreenRoute } from '@/navigation/registry';
import { ActivityFeedView } from './ActivityFeedView';

const route: ScreenRoute = {
  id: '012',
  path: '/admin/activity',
  roles: ['admin'],
  titleKey: 'activityFeed.title',
  Component: ActivityFeedView,
  tab: 'map',
};

export default route;
