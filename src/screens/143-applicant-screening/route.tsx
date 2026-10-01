import type { ScreenRoute } from '@/navigation/registry';
import { ScreeningScreen } from './ScreeningView';

const route: ScreenRoute = { id: '143', path: '/screening', roles: ['admin'], titleKey: 'screening.title', Component: ScreeningScreen, tab: 'partners' };

export default route;
