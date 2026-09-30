import type { ScreenRoute } from '@/navigation/registry';
import { DeliverySchedulingView } from './DeliverySchedulingView';

const route: ScreenRoute = {
  id: '101',
  path: '/deliveries',
  roles: ['admin', 'supplier'],
  titleKey: 'deliveryScheduling.title',
  Component: DeliverySchedulingView,
  tab: { admin: 'logistics', supplier: 'orders' },
};

export default route;
