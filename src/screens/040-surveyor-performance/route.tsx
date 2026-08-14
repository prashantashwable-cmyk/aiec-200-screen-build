import type { ScreenRoute } from '@/navigation/registry';
import { SurveyorPerformanceView } from './SurveyorPerformanceView';

const route: ScreenRoute = {
  id: '040',
  path: '/surveyor/performance',
  roles: ['surveyor'],
  titleKey: 'surveyorPerformance.title',
  Component: SurveyorPerformanceView,
  tab: 'home',
};

export default route;
