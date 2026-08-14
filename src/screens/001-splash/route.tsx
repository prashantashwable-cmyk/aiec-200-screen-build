import type { ScreenRoute } from '@/navigation/registry';
import { SplashView } from './SplashView';

const route: ScreenRoute = {
  id: '001',
  path: '/',
  roles: 'public',
  titleKey: 'splash.title',
  Component: SplashView,
  chromeless: true,
};

export default route;
