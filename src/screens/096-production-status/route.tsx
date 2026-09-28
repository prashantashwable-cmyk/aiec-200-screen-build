import type { ScreenRoute } from '@/navigation/registry';
import { ProductionStatusView } from './ProductionStatusView';

const route: ScreenRoute = {
  id: '096',
  path: '/orders/production/:recordId',
  roles: ['admin', 'supplier'],
  titleKey: 'productionStatus.title',
  Component: ProductionStatusView,
  tab: 'orders',
};

export default route;
