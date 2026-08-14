import type { ScreenRoute } from '@/navigation/registry';
import { OnboardSurveyorView } from './OnboardSurveyorView';

const route: ScreenRoute = {
  id: '005',
  path: '/onboarding/surveyor',
  roles: 'public',
  titleKey: 'onbSurveyor.title',
  Component: OnboardSurveyorView,
  chromeless: true,
};

export default route;
