import type { ScreenRoute } from '@/navigation/registry';
import { FollowupSchedulerView } from './FollowupSchedulerView';

const route: ScreenRoute = {
  id: '047',
  path: '/admin/leads/follow-ups',
  roles: ['admin'],
  titleKey: 'followupScheduler.title',
  Component: FollowupSchedulerView,
  tab: 'leads',
};

export default route;
