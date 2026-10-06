import type { ScreenRoute } from '@/navigation/registry';
import { ContestSetupScreen } from './ContestSetupView';

/** Admin's tool for contests: set one up with a prize structure, see how it would stand today before anyone sees it, end a flawed one early, and learn from past ones. */
const route: ScreenRoute = { id: '167', path: '/contest-setup', roles: ['admin'], titleKey: 'contestSetup.title', Component: ContestSetupScreen, tab: 'partners' };

export default route;
