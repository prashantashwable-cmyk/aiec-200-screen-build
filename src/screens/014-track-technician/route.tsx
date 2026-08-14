import type { ScreenRoute } from '@/navigation/registry';
import { TrackTechnicianView } from './TrackTechnicianView';

const route: ScreenRoute = {
  id: '014',
  path: '/admin/tracking/technician/:userId',
  roles: ['admin'],
  titleKey: 'trackTechnician.title',
  Component: TrackTechnicianView,
  tab: 'map',
};

export default route;
