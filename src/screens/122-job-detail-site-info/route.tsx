import type { ScreenRoute } from '@/navigation/registry';
import { JobDetailSiteInfoView } from './JobDetailSiteInfoView';

const route: ScreenRoute = {
  id: '122',
  path: '/technician/jobs/:jobId',
  roles: ['technician'],
  titleKey: 'technicianJob.title',
  Component: JobDetailSiteInfoView,
  tab: 'jobs',
};

export default route;
