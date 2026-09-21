import type { ScreenRoute } from '@/navigation/registry';
import { PaymentScheduleSetupView } from './PaymentScheduleSetupView';

const route: ScreenRoute = {
  id: '081',
  path: '/admin/deals/:dealId/schedule',
  roles: ['admin'],
  titleKey: 'paymentScheduleSetup.title',
  Component: PaymentScheduleSetupView,
  tab: 'deals',
};

export default route;
