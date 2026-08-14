import type { ScreenRoute } from '@/navigation/registry';
import { CommAnalyticsView } from './CommAnalyticsView';

const route: ScreenRoute = {
  id: '060',
  path: '/admin/comm/analytics',
  roles: ['admin'],
  titleKey: 'commAnalytics.title',
  Component: CommAnalyticsView,
  tab: 'comm',
};

export default route;
