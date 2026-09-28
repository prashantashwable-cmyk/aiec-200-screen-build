import type { ScreenRoute } from '@/navigation/registry';
import { PurchaseOrderGeneratorView } from './PurchaseOrderGeneratorView';

const route: ScreenRoute = {
  id: '092',
  path: '/admin/deals/:dealId/purchase-orders',
  roles: ['admin'],
  titleKey: 'purchaseOrderGenerator.title',
  Component: PurchaseOrderGeneratorView,
  tab: 'suppliers',
};

export default route;
