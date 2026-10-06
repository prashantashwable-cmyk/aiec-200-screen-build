import type { ScreenRoute } from '@/navigation/registry';
import { PayoutTrackerScreen } from './PayoutTrackerView';

/** Admin's view over the one commission ledger: what is waiting to be paid, what is not final yet, what was paid, by what earned it, with whatever stands out raised first. */
const route: ScreenRoute = { id: '162', path: '/payout-tracker', roles: ['admin'], titleKey: 'payoutTracker.title', Component: PayoutTrackerScreen, tab: 'partners' };

export default route;
