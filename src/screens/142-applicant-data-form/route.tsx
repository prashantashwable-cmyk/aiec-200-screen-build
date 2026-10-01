import type { ScreenRoute } from '@/navigation/registry';
import { ApplicationScreen } from './ApplicationView';

/** The applicant reaches their own application by its link (no account yet); Admin reaches the same record, and the board of all of them, in the app. */
const routes: ScreenRoute[] = [
  { id: '142', path: '/apply/:applicationId', roles: 'public', titleKey: 'application.title', Component: ApplicationScreen, chromeless: true },
  { id: '142', path: '/applications/:applicationId?', roles: ['admin'], titleKey: 'application.admin.title', Component: ApplicationScreen, tab: 'partners' },
];

export default routes;
