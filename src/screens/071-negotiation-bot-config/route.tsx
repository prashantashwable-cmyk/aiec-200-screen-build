import type { ScreenRoute } from '@/navigation/registry';
import { NegotiationBotConfigView } from './NegotiationBotConfigView';

const route: ScreenRoute = {
  id: '071',
  path: '/admin/deals/bot-config',
  roles: ['admin'],
  titleKey: 'negotiationBotConfig.title',
  Component: NegotiationBotConfigView,
  tab: 'deals',
};

export default route;
