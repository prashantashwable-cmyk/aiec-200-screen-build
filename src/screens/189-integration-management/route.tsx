import type { ScreenRoute } from '@/navigation/registry';
import { IntegrationManagementScreen } from './IntegrationManagementView';

/** The configuration root of every external connection: credentials (only ever masked), test and live mode, rotation without a scattered failure, and proof that demo traffic is isolated. */
const route: ScreenRoute = { id: '189', path: '/integrations', roles: ['admin'], titleKey: 'integrationManagement.title', Component: IntegrationManagementScreen, tab: 'settings' };

export default route;
