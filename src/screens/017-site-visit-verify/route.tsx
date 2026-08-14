import type { ScreenRoute } from '@/navigation/registry';
import { SiteVisitVerifyView } from './SiteVisitVerifyView';

const route: ScreenRoute = {
  id: '017',
  path: '/admin/site-visits',
  roles: ['admin'],
  titleKey: 'siteVisitVerify.title',
  Component: SiteVisitVerifyView,
  tab: 'map',
};

export default route;
