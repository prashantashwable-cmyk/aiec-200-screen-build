import type { ScreenRoute } from '@/navigation/registry';
import { DeliveryConfirmationView } from './DeliveryConfirmationView';

const route: ScreenRoute = {
  id: '104',
  path: '/delivery-confirmation',
  roles: ['admin', 'technician', 'customer'],
  titleKey: 'deliveryConfirmation.title',
  Component: DeliveryConfirmationView,
  tab: { admin: 'logistics', technician: 'shipments', customer: 'shipments' },
};

export default route;
