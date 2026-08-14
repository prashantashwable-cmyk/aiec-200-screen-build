import type { ScreenRoute } from '@/navigation/registry';
import { ForgotPasswordView } from './ForgotPasswordView';

const route: ScreenRoute = {
  id: '009',
  path: '/forgot-password',
  roles: 'public',
  titleKey: 'forgotPassword.title',
  Component: ForgotPasswordView,
  chromeless: true,
};

export default route;
