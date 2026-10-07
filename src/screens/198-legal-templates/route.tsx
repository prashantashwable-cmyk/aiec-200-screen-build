import type { ScreenRoute } from '@/navigation/registry';
import { LegalTemplatesScreen } from './LegalTemplatesView';

/** The legal wording AIEC uses, in one place: versions, the day each takes effect, state clauses, and the day a professional last reviewed each. */
const route: ScreenRoute = { id: '198', path: '/legal-templates', roles: ['admin'], titleKey: 'legal.title', Component: LegalTemplatesScreen, tab: 'settings' };

export default route;
