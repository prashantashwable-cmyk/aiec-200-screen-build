import type { ScreenRoute } from '@/navigation/registry';
import { LeadInboxView } from './LeadInboxView';

const route: ScreenRoute = {
  id: '041',
  path: '/admin/leads',
  roles: ['admin'],
  titleKey: 'leadInbox.title',
  Component: LeadInboxView,
  tab: 'leads',
};

export default route;
