import type { ScreenRoute } from '@/navigation/registry';
import { OnboardCustomerView } from './OnboardCustomerView';

const route: ScreenRoute = {
  id: '008',
  path: '/onboarding/customer',
  roles: 'public',
  titleKey: 'onbCustomer.title',
  Component: OnboardCustomerView,
  chromeless: true,
};

export default route;
