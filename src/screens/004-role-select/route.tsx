import type { ScreenRoute } from '@/navigation/registry';
import { RoleSelectView } from './RoleSelectView';

const route: ScreenRoute = {
  id: '004',
  path: '/onboarding/role',
  roles: 'public',
  titleKey: 'roleSelect.title',
  Component: RoleSelectView,
  chromeless: true,
};

export default route;
