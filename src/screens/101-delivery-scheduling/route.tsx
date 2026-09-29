import type { ScreenRoute } from '@/navigation/registry';
import { DeliverySchedulingView } from './DeliverySchedulingView';

const route: ScreenRoute = {
  id: '101',
  path: '/deliveries',
  roles: ['admin', 'supplier'],
  titleKey: 'deliveryScheduling.title',
  Component: DeliverySchedulingView,
  tab: { admin: 'suppliers', supplier: 'orders' },
};

export default route;
