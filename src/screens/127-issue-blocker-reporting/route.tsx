import type { ScreenRoute } from '@/navigation/registry';
import { IssueReportingView } from './IssueReportingView';

const route: ScreenRoute = {
  id: '127',
  path: '/job-issues/:jobId?',
  roles: ['technician', 'admin'],
  titleKey: 'issueReport.title',
  Component: IssueReportingView,
  tab: { admin: 'map', technician: 'jobs' },
};

export default route;
