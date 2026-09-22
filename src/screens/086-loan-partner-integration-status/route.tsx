import type { ScreenRoute } from '@/navigation/registry';
import { LoanPartnerIntegrationStatusView } from './LoanPartnerIntegrationStatusView';

const route: ScreenRoute = {
  id: '086',
  path: '/admin/analytics/financing',
  roles: ['admin'],
  titleKey: 'loanPartnerStatus.title',
  Component: LoanPartnerIntegrationStatusView,
  tab: 'analytics',
};

export default route;
