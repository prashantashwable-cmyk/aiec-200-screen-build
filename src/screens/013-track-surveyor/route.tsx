import type { ScreenRoute } from '@/navigation/registry';
import { TrackSurveyorView } from './TrackSurveyorView';

const route: ScreenRoute = {
  id: '013',
  path: '/admin/tracking/surveyor/:userId',
  roles: ['admin'],
  titleKey: 'trackSurveyor.title',
  Component: TrackSurveyorView,
  tab: 'map',
};

export default route;
