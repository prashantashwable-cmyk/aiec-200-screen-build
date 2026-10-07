import type { ScreenRoute } from '@/navigation/registry';
import { AutomationSandboxScreen } from './AutomationSandboxView';

/** Try a rule on typical situations before it touches anyone, compare a change with what was accepted, and take a tested rule live. Nothing here changes a real record. */
const route: ScreenRoute = { id: '190', path: '/automation-sandbox', roles: ['admin'], titleKey: 'automationSandbox.title', Component: AutomationSandboxScreen, tab: 'analytics' };

export default route;
