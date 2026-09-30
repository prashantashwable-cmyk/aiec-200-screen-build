import type { ScreenRoute } from '@/navigation/registry';
import { SupplierInvoiceMatchingView } from './SupplierInvoiceMatchingView';

const route: ScreenRoute = {
  id: '113',
  path: '/supplier-invoices',
  roles: ['admin', 'supplier'],
  titleKey: 'supplierInvoiceMatching.title',
  Component: SupplierInvoiceMatchingView,
  tab: { admin: 'suppliers', supplier: 'invoices' },
};

export default route;
