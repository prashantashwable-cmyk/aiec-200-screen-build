import type { ScreenRoute } from '@/navigation/registry';
import { FunnelView } from './FunnelView';

const route: ScreenRoute = {
  id: '022',
  path: '/admin/analytics/funnel',
  roles: ['admin'],
  titleKey: 'funnel.title',
  Component: FunnelView,
  tab: 'analytics',
};

export default route;
