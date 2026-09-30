import type { ScreenRoute } from '@/navigation/registry';
import { StockInTransitView } from './StockInTransitView';

const route: ScreenRoute = {
  id: '106',
  path: '/stock-in-transit',
  roles: ['admin'],
  titleKey: 'stockInTransit.title',
  Component: StockInTransitView,
  tab: 'logistics',
};

export default route;
