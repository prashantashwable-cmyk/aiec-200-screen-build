import type { ScreenRoute } from '@/navigation/registry';
import { lazyScreen } from '@/navigation/lazyScreen';

const LoginView = lazyScreen(() => import('./LoginView'), 'LoginView');

const route: ScreenRoute = {
  id: '002',
  path: '/login',
  roles: 'public',
  titleKey: 'login.title',
  Component: LoginView,
  chromeless: true,
};

export default route;
