import type { ScreenRoute } from '@/navigation/registry';
import { PaymentCollectionDashboardView } from './PaymentCollectionDashboardView';

const route: ScreenRoute = {
  id: '082',
  path: '/admin/analytics/collections',
  roles: ['admin'],
  titleKey: 'paymentCollectionDashboard.title',
  Component: PaymentCollectionDashboardView,
  tab: 'analytics',
};

export default route;
