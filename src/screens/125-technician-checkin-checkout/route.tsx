import type { ScreenRoute } from '@/navigation/registry';
import { CheckinCheckoutView } from './CheckinCheckoutView';

const route: ScreenRoute = {
  id: '125',
  path: '/technician/jobs/:jobId/checkin',
  roles: ['technician'],
  titleKey: 'siteCheckIn.title',
  Component: CheckinCheckoutView,
  tab: 'jobs',
};

export default route;
