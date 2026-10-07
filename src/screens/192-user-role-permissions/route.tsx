import type { ScreenRoute } from '@/navigation/registry';
import { UserRolePermissionsScreen } from './UserRolePermissionsView';

/** Who may open which screen, per role and per person: the router reads this table, every change is recorded, and exceptions need a reason and an end. */
const route: ScreenRoute = { id: '192', path: '/access-control', roles: ['admin'], titleKey: 'accessControl.title', Component: UserRolePermissionsScreen, tab: 'settings' };

export default route;
