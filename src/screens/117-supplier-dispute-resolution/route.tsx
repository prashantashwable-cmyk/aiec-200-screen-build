import type { ScreenRoute } from '@/navigation/registry';
import { SupplierDisputeResolutionView } from './SupplierDisputeResolutionView';

const route: ScreenRoute = {
  id: '117',
  path: '/supplier-disputes',
  roles: ['admin'],
  titleKey: 'supplierDispute.title',
  Component: SupplierDisputeResolutionView,
  tab: 'suppliers',
};

export default route;
