import type { ScreenRoute } from '@/navigation/registry';
import { ObjectionScriptsView } from './ObjectionScriptsView';

const route: ScreenRoute = {
  id: '078',
  path: '/admin/deals/objection-scripts',
  roles: ['admin'],
  titleKey: 'objectionScripts.title',
  Component: ObjectionScriptsView,
  tab: 'deals',
};

export default route;
