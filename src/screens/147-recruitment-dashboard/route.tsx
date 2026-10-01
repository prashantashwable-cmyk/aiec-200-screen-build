import type { ScreenRoute } from '@/navigation/registry';
import { DashboardScreen } from './DashboardView';

const route: ScreenRoute = { id: '147', path: '/recruitment', roles: ['admin'], titleKey: 'recruitDash.title', Component: DashboardScreen, tab: 'partners' };

export default route;
