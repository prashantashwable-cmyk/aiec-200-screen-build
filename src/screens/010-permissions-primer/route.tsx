import type { ScreenRoute } from '@/navigation/registry';
import { PermissionsPrimerView } from './PermissionsPrimerView';

const route: ScreenRoute = {
  id: '010',
  path: '/onboarding/permissions',
  roles: 'public',
  titleKey: 'permissions.title',
  Component: PermissionsPrimerView,
  chromeless: true,
};

export default route;
