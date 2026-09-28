import type { ScreenRoute } from '@/navigation/registry';
import { SupplierCatalogView } from './SupplierCatalogView';

const route: ScreenRoute = {
  id: '093',
  path: '/catalog',
  roles: ['admin', 'supplier'],
  titleKey: 'supplierCatalog.title',
  Component: SupplierCatalogView,
  tab: 'catalog',
};

export default route;
