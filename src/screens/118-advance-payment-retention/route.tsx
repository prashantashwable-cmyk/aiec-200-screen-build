import type { ScreenRoute } from '@/navigation/registry';
import { AdvancePaymentRetentionView } from './AdvancePaymentRetentionView';

const route: ScreenRoute = {
  id: '118',
  path: '/advance-retention',
  roles: ['admin'],
  titleKey: 'advanceRetention.title',
  Component: AdvancePaymentRetentionView,
  tab: 'supplierPay',
};

export default route;
