import type { ScreenRoute } from '@/navigation/registry';
import { RevenueView } from './RevenueView';

const route: ScreenRoute = {
  id: '023',
  path: '/admin/analytics/revenue',
  roles: ['admin'],
  titleKey: 'revenue.title',
  Component: RevenueView,
  tab: 'analytics',
};

export default route;
