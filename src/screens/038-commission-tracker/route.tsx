import type { ScreenRoute } from '@/navigation/registry';
import { CommissionTrackerView } from './CommissionTrackerView';

const route: ScreenRoute = {
  id: '038',
  path: '/surveyor/earnings',
  roles: ['surveyor'],
  titleKey: 'commissionTracker.title',
  Component: CommissionTrackerView,
  tab: 'earnings',
};

export default route;
