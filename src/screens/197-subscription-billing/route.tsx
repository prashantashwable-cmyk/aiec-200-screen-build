import type { ScreenRoute } from '@/navigation/registry';
import { SubscriptionBillingScreen } from './SubscriptionBillingView';

/** What AIEC pays to keep its own software running: plans, usage, renewals, and bills that are about to go wrong. */
const route: ScreenRoute = { id: '197', path: '/billing', roles: ['admin'], titleKey: 'billing.title', Component: SubscriptionBillingScreen, tab: 'settings' };

export default route;
