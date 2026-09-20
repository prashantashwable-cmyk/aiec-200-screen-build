import type { ScreenRoute } from '@/navigation/registry';
import { DealClosureConfirmationView } from './DealClosureConfirmationView';

const route: ScreenRoute = {
  id: '077',
  path: '/admin/deals/:dealId/closure',
  roles: ['admin'],
  titleKey: 'dealClosureConfirmation.title',
  Component: DealClosureConfirmationView,
  tab: 'deals',
};

export default route;
