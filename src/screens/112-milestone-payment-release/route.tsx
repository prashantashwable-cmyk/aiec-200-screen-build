import type { ScreenRoute } from '@/navigation/registry';
import { MilestonePaymentReleaseView } from './MilestonePaymentReleaseView';

const route: ScreenRoute = {
  id: '112',
  path: '/supplier-payment-release',
  roles: ['admin'],
  titleKey: 'supplierPaymentRelease.title',
  Component: MilestonePaymentReleaseView,
  tab: 'supplierPay',
};

export default route;
