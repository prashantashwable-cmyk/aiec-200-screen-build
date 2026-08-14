import type { ScreenRoute } from '@/navigation/registry';
import { RoutePlanView } from './RoutePlanView';

const route: ScreenRoute = {
  id: '039',
  path: '/surveyor/route',
  roles: ['surveyor'],
  titleKey: 'routePlan.title',
  Component: RoutePlanView,
  tab: 'route',
};

export default route;
