import type { ScreenRoute } from '@/navigation/registry';
import { LeadAssignmentView } from './LeadAssignmentView';

const route: ScreenRoute = {
  id: '044',
  path: '/admin/leads/assignment',
  roles: ['admin'],
  titleKey: 'leadAssignment.title',
  Component: LeadAssignmentView,
  tab: 'leads',
};

export default route;
