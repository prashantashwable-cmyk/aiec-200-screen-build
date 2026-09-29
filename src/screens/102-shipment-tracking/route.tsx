import type { ScreenRoute } from '@/navigation/registry';
import { ShipmentTrackingView } from './ShipmentTrackingView';

const route: ScreenRoute = {
  id: '102',
  path: '/shipments',
  roles: ['admin', 'customer', 'technician', 'supplier'],
  titleKey: 'shipmentTracking.title',
  Component: ShipmentTrackingView,
  tab: { admin: 'suppliers', supplier: 'orders', customer: 'shipments', technician: 'shipments' },
};

export default route;
