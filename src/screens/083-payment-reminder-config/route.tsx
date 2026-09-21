import type { ScreenRoute } from '@/navigation/registry';
import { PaymentReminderConfigView } from './PaymentReminderConfigView';

const route: ScreenRoute = {
  id: '083',
  path: '/admin/analytics/collections/reminders',
  roles: ['admin'],
  titleKey: 'paymentReminderConfig.title',
  Component: PaymentReminderConfigView,
  tab: 'analytics',
};

export default route;
