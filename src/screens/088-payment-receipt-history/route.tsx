import type { ScreenRoute } from '@/navigation/registry';
import { PaymentReceiptHistoryView } from './PaymentReceiptHistoryView';

const route: ScreenRoute = {
  id: '088',
  path: '/payments/history',
  roles: ['admin', 'customer'],
  titleKey: 'paymentReceiptHistory.title',
  Component: PaymentReceiptHistoryView,
  tab: 'analytics',
};

export default route;
