import type { ScreenRoute } from '@/navigation/registry';
import { DeliveryChecklistView } from './DeliveryChecklistView';

const route: ScreenRoute = {
  id: '103',
  path: '/delivery-checklist',
  roles: ['admin', 'technician'],
  titleKey: 'deliveryChecklist.title',
  Component: DeliveryChecklistView,
  tab: { admin: 'suppliers', technician: 'shipments' },
};

export default route;
