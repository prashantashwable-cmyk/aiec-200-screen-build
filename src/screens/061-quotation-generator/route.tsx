import type { ScreenRoute } from '@/navigation/registry';
import { QuotationGeneratorView } from './QuotationGeneratorView';

const route: ScreenRoute = {
  id: '061',
  path: '/admin/quotes',
  roles: ['admin'],
  titleKey: 'quotationGenerator.title',
  Component: QuotationGeneratorView,
  tab: 'quotes',
};

export default route;
