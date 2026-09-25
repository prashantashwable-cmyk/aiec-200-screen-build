import type { ScreenRoute } from '@/navigation/registry';
import { RefundDisputeManagementView } from './RefundDisputeManagementView';

const route: ScreenRoute = {
  id: '090',
  path: '/admin/analytics/collections/disputes',
  roles: ['admin'],
  titleKey: 'refundDisputeManagement.title',
  Component: RefundDisputeManagementView,
  tab: 'analytics',
};

export default route;
