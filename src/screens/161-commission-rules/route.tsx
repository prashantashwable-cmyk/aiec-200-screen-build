import type { ScreenRoute } from '@/navigation/registry';
import { CommissionRulesScreen } from './CommissionRulesView';

/** The one place every commission rate is set: versioned rules, tier effects read from the partner tiers, a simulator, and a change that never reaches back to what has been earned. */
const route: ScreenRoute = { id: '161', path: '/commission-rules', roles: ['admin'], titleKey: 'commissionRules.title', Component: CommissionRulesScreen, tab: 'partners' };

export default route;
