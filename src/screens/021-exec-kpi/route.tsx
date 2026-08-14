import type { ScreenRoute } from '@/navigation/registry';
import { ExecKpiView } from './ExecKpiView';

const route: ScreenRoute = {
  id: '021',
  path: '/admin',
  roles: ['admin'],
  titleKey: 'execKpi.title',
  Component: ExecKpiView,
  tab: 'home',
};

export default route;
