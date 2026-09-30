import type { ScreenRoute } from '@/navigation/registry';
import { WarrantyScreen } from './WarrantyView';

const route: ScreenRoute = {
  id: '139',
  path: '/warranty/:jobId?',
  roles: ['admin', 'customer'],
  titleKey: 'warranty.title',
  Component: WarrantyScreen,
  tab: { admin: 'map', customer: 'installation' },
};

export default route;
