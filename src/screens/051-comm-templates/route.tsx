import type { ScreenRoute } from '@/navigation/registry';
import { CommTemplatesView } from './CommTemplatesView';

const route: ScreenRoute = {
  id: '051',
  path: '/admin/comm/templates',
  roles: ['admin'],
  titleKey: 'commTemplates.title',
  Component: CommTemplatesView,
  tab: 'comm',
};

export default route;
