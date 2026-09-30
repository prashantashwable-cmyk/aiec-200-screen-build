import type { ScreenRoute } from '@/navigation/registry';
import { TaxGstComplianceView } from './TaxGstComplianceView';

const route: ScreenRoute = {
  id: '116',
  path: '/gst-compliance',
  roles: ['admin'],
  titleKey: 'gstCompliance.title',
  Component: TaxGstComplianceView,
  tab: 'supplierPay',
};

export default route;
