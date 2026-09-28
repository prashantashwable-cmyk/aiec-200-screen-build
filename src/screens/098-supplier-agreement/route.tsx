import type { ScreenRoute } from '@/navigation/registry';
import { SupplierAgreementView } from './SupplierAgreementView';

const route: ScreenRoute = {
  id: '098',
  path: '/agreement',
  roles: ['admin', 'supplier'],
  titleKey: 'supplierAgreement.title',
  Component: SupplierAgreementView,
  tab: 'agreement',
};

export default route;
