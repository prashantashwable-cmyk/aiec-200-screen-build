import type { ScreenRoute } from '@/navigation/registry';
import { DeliveryPartnerManagementView } from './DeliveryPartnerManagementView';

const route: ScreenRoute = {
  id: '109',
  path: '/delivery-partners',
  roles: ['admin'],
  titleKey: 'deliveryPartners.title',
  Component: DeliveryPartnerManagementView,
  tab: 'suppliers',
};

export default route;
