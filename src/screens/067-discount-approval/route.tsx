import type { ScreenRoute } from '@/navigation/registry';
import { DiscountApprovalView } from './DiscountApprovalView';

const route: ScreenRoute = {
  id: '067',
  path: '/admin/quotes/discounts',
  roles: ['admin'],
  titleKey: 'discountApproval.title',
  Component: DiscountApprovalView,
  tab: 'quotes',
};

export default route;
