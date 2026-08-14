import type { ScreenRoute } from '@/navigation/registry';
import { LeadDetailView } from './LeadDetailView';

const route: ScreenRoute = {
  id: '042',
  path: '/admin/leads/:leadId',
  roles: ['admin'],
  titleKey: 'leadDetail.section.overview',
  Component: LeadDetailView,
  tab: 'leads',
};

export default route;
