import type { ScreenRoute } from '@/navigation/registry';
import { CallLogView } from './CallLogView';

const route: ScreenRoute = {
  id: '054',
  path: '/admin/comm/calls',
  roles: ['admin'],
  titleKey: 'callLog.title',
  Component: CallLogView,
  tab: 'comm',
};

export default route;
