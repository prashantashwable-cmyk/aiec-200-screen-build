import type { ScreenRoute } from '@/navigation/registry';
import { ReportBuilderView } from './ReportBuilderView';

const route: ScreenRoute = {
  id: '030',
  path: '/admin/reports',
  roles: ['admin'],
  titleKey: 'reportBuilder.title',
  Component: ReportBuilderView,
  tab: 'analytics',
};

export default route;
