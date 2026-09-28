import type { ScreenRoute } from '@/navigation/registry';
import { SupplierPaymentTermsView } from './SupplierPaymentTermsView';

const route: ScreenRoute = {
  id: '100',
  path: '/admin/suppliers/payment-terms',
  roles: ['admin'],
  titleKey: 'supplierPaymentTerms.title',
  Component: SupplierPaymentTermsView,
};

export default route;
