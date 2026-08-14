import type { ScreenRoute } from '@/navigation/registry';
import { QuotationTemplateView } from './QuotationTemplateView';

const route: ScreenRoute = {
  id: '063',
  path: '/admin/quotes/templates',
  roles: ['admin'],
  titleKey: 'quotationTemplate.title',
  Component: QuotationTemplateView,
  tab: 'quotes',
};

export default route;
