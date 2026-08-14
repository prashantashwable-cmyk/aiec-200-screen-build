import type { ScreenRoute } from '@/navigation/registry';
import { MapFiltersView } from './MapFiltersView';

const route: ScreenRoute = {
  id: '018',
  path: '/admin/map/filters',
  roles: ['admin'],
  titleKey: 'mapFilters.title',
  Component: MapFiltersView,
  tab: 'map',
};

export default route;
