import type { ScreenRoute } from '@/navigation/registry';
import { VerificationScreen } from './VerificationView';

const route: ScreenRoute = { id: '145', path: '/verification/:applicationId?', roles: ['admin'], titleKey: 'verification.title', Component: VerificationScreen, tab: 'partners' };

export default route;
