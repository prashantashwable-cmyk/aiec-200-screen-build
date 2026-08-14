import type { ScreenRoute } from '@/navigation/registry';
import { FinanceView } from './FinanceView';

const route: ScreenRoute = {
  id: '028',
  path: '/admin/analytics/finance',
  roles: ['admin'],
  titleKey: 'finance.title',
  Component: FinanceView,
  tab: 'analytics',
};

export default route;
