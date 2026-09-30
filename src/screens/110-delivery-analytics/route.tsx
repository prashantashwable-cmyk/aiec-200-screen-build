import type { ScreenRoute } from '@/navigation/registry';
import { DeliveryAnalyticsView } from './DeliveryAnalyticsView';

const route: ScreenRoute = {
  id: '110',
  path: '/delivery-analytics',
  roles: ['admin'],
  titleKey: 'deliveryAnalytics.title',
  Component: DeliveryAnalyticsView,
  tab: 'logistics',
};

export default route;
