import type { ScreenRoute } from '@/navigation/registry';
import { SurveyorHomeView } from './SurveyorHomeView';

const route: ScreenRoute = {
  id: '031',
  path: '/surveyor',
  roles: ['surveyor'],
  titleKey: 'surveyorHome.title',
  Component: SurveyorHomeView,
  tab: 'home',
};

export default route;
