import type { ScreenRoute } from '@/navigation/registry';
import { OverduePaymentEscalationView } from './OverduePaymentEscalationView';

const route: ScreenRoute = {
  id: '089',
  path: '/admin/analytics/collections/escalation',
  roles: ['admin'],
  titleKey: 'overduePaymentEscalation.title',
  Component: OverduePaymentEscalationView,
  tab: 'analytics',
};

export default route;
