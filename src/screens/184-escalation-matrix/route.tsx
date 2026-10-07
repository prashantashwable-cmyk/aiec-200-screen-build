import type { ScreenRoute } from '@/navigation/registry';
import { EscalationMatrixScreen } from './EscalationMatrixView';

/** Who is told, in what order and after what delay, when something nobody has answered is left standing: one configuration for every scenario, a backup path, and drills that prove it works. */
const route: ScreenRoute = { id: '184', path: '/escalation-matrix', roles: ['admin'], titleKey: 'escalationMatrix.title', Component: EscalationMatrixScreen, tab: 'analytics' };

export default route;
