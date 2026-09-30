import type { ScreenRoute } from '@/navigation/registry';
import { SupplierPaymentApprovalView } from './SupplierPaymentApprovalView';

const route: ScreenRoute = {
  id: '111',
  path: '/supplier-payments',
  roles: ['admin'],
  titleKey: 'supplierPaymentApproval.title',
  Component: SupplierPaymentApprovalView,
  tab: 'supplierPay',
};

export default route;
