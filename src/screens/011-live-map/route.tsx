import type { ScreenRoute } from '@/navigation/registry';
import { LiveMapView } from './LiveMapView';

const route: ScreenRoute = {
  id: '011',
  path: '/admin/map',
  roles: ['admin'],
  titleKey: 'liveMap.title',
  Component: LiveMapView,
  tab: 'map',
};

export default route;
