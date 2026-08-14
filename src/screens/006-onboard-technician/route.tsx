import type { ScreenRoute } from '@/navigation/registry';
import { OnboardTechnicianView } from './OnboardTechnicianView';

const route: ScreenRoute = {
  id: '006',
  path: '/onboarding/technician',
  roles: 'public',
  titleKey: 'onbTechnician.title',
  Component: OnboardTechnicianView,
  chromeless: true,
};

export default route;
