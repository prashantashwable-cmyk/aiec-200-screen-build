import type { ScreenRoute } from '@/navigation/registry';
import { LoginView } from './LoginView';

const route: ScreenRoute = {
  id: '002',
  path: '/login',
  roles: 'public',
  titleKey: 'login.title',
  Component: LoginView,
  chromeless: true,
};

export default route;
