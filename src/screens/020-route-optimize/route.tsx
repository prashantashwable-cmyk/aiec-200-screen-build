import type { ScreenRoute } from '@/navigation/registry';
import { RouteOptimizeView } from './RouteOptimizeView';

const route: ScreenRoute = {
  id: '020',
  path: '/admin/routes',
  roles: ['admin'],
  titleKey: 'routeOptimize.title',
  Component: RouteOptimizeView,
  tab: 'map',
};

export default route;
