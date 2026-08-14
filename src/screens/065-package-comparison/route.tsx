import type { ScreenRoute } from '@/navigation/registry';
import { PackageComparisonView } from './PackageComparisonView';

const route: ScreenRoute = {
  id: '065',
  path: '/admin/quotes/compare',
  roles: ['admin'],
  titleKey: 'packageComparison.title',
  Component: PackageComparisonView,
  tab: 'quotes',
};

export default route;
