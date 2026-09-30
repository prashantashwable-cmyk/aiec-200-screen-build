import type { ScreenRoute } from '@/navigation/registry';
import { SupplierPaymentAnalyticsView } from './SupplierPaymentAnalyticsView';

const route: ScreenRoute = {
  id: '119',
  path: '/supplier-payment-analytics',
  roles: ['admin'],
  titleKey: 'supplierPaymentAnalytics.title',
  Component: SupplierPaymentAnalyticsView,
  tab: 'suppliers',
};

export default route;
