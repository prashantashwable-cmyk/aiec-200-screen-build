import type { ScreenRoute } from '@/navigation/registry';
import { SupplierOrdersView } from './SupplierOrdersView';

const route: ScreenRoute = {
  id: '095',
  path: '/orders',
  roles: ['admin', 'supplier'],
  titleKey: 'supplierOrders.title',
  Component: SupplierOrdersView,
  tab: 'orders',
};

export default route;
