import type { ScreenRoute } from '@/navigation/registry';
import { DeliveryDelayAlertView } from './DeliveryDelayAlertView';

const route: ScreenRoute = {
  id: '105',
  path: '/delivery-delays',
  roles: ['admin'],
  titleKey: 'deliveryDelay.title',
  Component: DeliveryDelayAlertView,
  tab: 'logistics',
};

export default route;
