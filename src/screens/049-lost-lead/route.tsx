import type { ScreenRoute } from '@/navigation/registry';
import { LostLeadView } from './LostLeadView';

const route: ScreenRoute = {
  id: '049',
  path: '/admin/leads/:leadId/lost',
  roles: ['admin'],
  titleKey: 'lostLead.title',
  Component: LostLeadView,
  tab: 'leads',
};

export default route;
