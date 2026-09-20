import type { ScreenRoute } from '@/navigation/registry';
import { QuotationSendView } from './QuotationSendView';

const route: ScreenRoute = {
  id: '068',
  path: '/admin/quotes/:quotationId/send',
  roles: ['admin'],
  titleKey: 'quotationSend.title',
  Component: QuotationSendView,
  tab: 'quotes',
};

export default route;
