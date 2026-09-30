import type { ScreenRoute } from '@/navigation/registry';
import { ReworkScreen } from './ReworkView';

const route: ScreenRoute = {
  id: '136',
  path: '/rework/:snagId?',
  roles: ['technician', 'admin'],
  titleKey: 'rework.title',
  Component: ReworkScreen,
  tab: { admin: 'map', technician: 'jobs' },
};

export default route;
