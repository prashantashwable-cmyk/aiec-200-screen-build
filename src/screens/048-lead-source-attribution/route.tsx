import type { ScreenRoute } from '@/navigation/registry';
import { LeadSourceAttributionView } from './LeadSourceAttributionView';

const route: ScreenRoute = {
  id: '048',
  path: '/admin/leads/attribution',
  roles: ['admin'],
  titleKey: 'leadSourceAttribution.title',
  Component: LeadSourceAttributionView,
  tab: 'leads',
};

export default route;
