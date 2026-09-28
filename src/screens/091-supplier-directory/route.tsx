import type { ScreenRoute } from '@/navigation/registry';
import { SupplierDirectoryView } from './SupplierDirectoryView';

const route: ScreenRoute = {
  id: '091',
  path: '/admin/suppliers',
  roles: ['admin'],
  titleKey: 'supplierDirectory.title',
  Component: SupplierDirectoryView,
  tab: 'suppliers',
};

export default route;
