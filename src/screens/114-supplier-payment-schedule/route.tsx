import type { ScreenRoute } from '@/navigation/registry';
import { SupplierPaymentScheduleView } from './SupplierPaymentScheduleView';

const route: ScreenRoute = {
  id: '114',
  path: '/supplier-payment-schedule',
  roles: ['admin'],
  titleKey: 'supplierPaymentSchedule.title',
  Component: SupplierPaymentScheduleView,
  tab: 'suppliers',
};

export default route;
