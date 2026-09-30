import type { ScreenRoute } from '@/navigation/registry';
import { AutoReconciliationView } from './AutoReconciliationView';

const route: ScreenRoute = {
  id: '120',
  path: '/reconciliation',
  roles: ['admin'],
  titleKey: 'reconciliation.title',
  Component: AutoReconciliationView,
  tab: 'analytics',
};

export default route;
