import type { ScreenRoute } from '@/navigation/registry';
import { WhatsappConsoleView } from './WhatsappConsoleView';

const route: ScreenRoute = {
  id: '053',
  path: '/admin/comm/whatsapp',
  roles: ['admin'],
  titleKey: 'whatsappConsole.title',
  Component: WhatsappConsoleView,
  tab: 'comm',
};

export default route;
