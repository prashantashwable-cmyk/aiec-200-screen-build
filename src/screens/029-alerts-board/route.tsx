import type { ScreenRoute } from '@/navigation/registry';
import { AlertsBoardView } from './AlertsBoardView';

const route: ScreenRoute = {
  id: '029',
  path: '/admin/alerts',
  roles: ['admin'],
  titleKey: 'alertsBoard.title',
  Component: AlertsBoardView,
  tab: 'alerts',
};

export default route;
