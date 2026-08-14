import type { ScreenRoute } from '@/navigation/registry';
import { SmsBroadcastView } from './SmsBroadcastView';

const route: ScreenRoute = {
  id: '055',
  path: '/admin/comm/broadcast',
  roles: ['admin'],
  titleKey: 'smsBroadcast.title',
  Component: SmsBroadcastView,
  tab: 'comm',
};

export default route;
