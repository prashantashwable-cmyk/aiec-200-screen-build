import type { ScreenRoute } from '@/navigation/registry';
import { MyLeadsView } from './MyLeadsView';

const route: ScreenRoute = {
  id: '037',
  path: '/surveyor/leads',
  roles: ['surveyor'],
  titleKey: 'myLeads.title',
  Component: MyLeadsView,
  tab: 'leads',
};

export default route;
