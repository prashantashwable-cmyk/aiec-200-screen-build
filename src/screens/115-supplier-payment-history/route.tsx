import type { ScreenRoute } from '@/navigation/registry';
import { SupplierPaymentHistoryView } from './SupplierPaymentHistoryView';

const route: ScreenRoute = {
  id: '115',
  path: '/supplier-payment-history',
  roles: ['admin', 'supplier'],
  titleKey: 'supplierPaymentHistory.title',
  Component: SupplierPaymentHistoryView,
  tab: { admin: 'suppliers', supplier: 'payments' },
};

export default route;
