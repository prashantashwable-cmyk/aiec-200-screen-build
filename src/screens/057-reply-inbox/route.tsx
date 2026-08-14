import type { ScreenRoute } from '@/navigation/registry';
import { ReplyInboxView } from './ReplyInboxView';

const route: ScreenRoute = {
  id: '057',
  path: '/admin/comm/inbox',
  roles: ['admin'],
  titleKey: 'replyInbox.title',
  Component: ReplyInboxView,
  tab: 'comm',
};

export default route;
