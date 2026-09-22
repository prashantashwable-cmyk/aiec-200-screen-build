import type { ScreenRoute } from '@/navigation/registry';
import { LoanEmiApplicationView } from './LoanEmiApplicationView';

const route: ScreenRoute = {
  id: '085',
  path: '/customer/deals/:dealId/loan-application',
  roles: ['customer'],
  titleKey: 'loanEmiApplication.title',
  Component: LoanEmiApplicationView,
  tab: 'home',
};

export default route;
