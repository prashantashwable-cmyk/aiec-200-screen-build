import type { ScreenRoute } from '@/navigation/registry';
import { CounterOfferApprovalView } from './CounterOfferApprovalView';

const route: ScreenRoute = {
  id: '073',
  path: '/admin/deals/counter-offers',
  roles: ['admin'],
  titleKey: 'counterOfferApproval.title',
  Component: CounterOfferApprovalView,
  tab: 'deals',
};

export default route;
