import type { ScreenRoute } from '@/navigation/registry';
import { TerritoriesView } from './TerritoriesView';

const route: ScreenRoute = {
  id: '015',
  path: '/admin/territories',
  roles: ['admin'],
  titleKey: 'territories.title',
  Component: TerritoriesView,
  tab: 'map',
};

export default route;
