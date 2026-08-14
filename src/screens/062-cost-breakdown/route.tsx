import type { ScreenRoute } from '@/navigation/registry';
import { CostBreakdownView } from './CostBreakdownView';

const route: ScreenRoute = {
  id: '062',
  path: '/admin/quotes/:quotationId/cost',
  roles: ['admin'],
  titleKey: 'costBreakdown.title',
  Component: CostBreakdownView,
  tab: 'quotes',
};

export default route;
