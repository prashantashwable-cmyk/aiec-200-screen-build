import type { ScreenRoute } from '@/navigation/registry';
import { HeatmapView } from './HeatmapView';

const route: ScreenRoute = {
  id: '016',
  path: '/admin/heatmap',
  roles: ['admin'],
  titleKey: 'heatmap.title',
  Component: HeatmapView,
  tab: 'map',
};

export default route;
