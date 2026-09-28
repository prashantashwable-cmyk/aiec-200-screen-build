import type { ScreenRoute } from '@/navigation/registry';
import { SupplierMessagesView } from './SupplierMessagesView';

const route: ScreenRoute = {
  id: '099',
  path: '/supplier-messages',
  roles: ['admin', 'supplier'],
  titleKey: 'supplierMessages.title',
  Component: SupplierMessagesView,
  tab: 'messages',
};

export default route;
