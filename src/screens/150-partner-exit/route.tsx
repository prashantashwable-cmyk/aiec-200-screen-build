import type { ScreenRoute } from '@/navigation/registry';
import { PartnerExitScreen } from './PartnerExitView';

/** Admin only: leaving touches work, money and access, so it is one guided flow for one person, never a switch on a list. */
const route: ScreenRoute = { id: '150', path: '/partner-exit/:partnerId?', roles: ['admin'], titleKey: 'partnerExit.title', Component: PartnerExitScreen, tab: 'partners' };

export default route;
