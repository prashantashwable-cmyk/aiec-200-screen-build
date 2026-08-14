import type { ScreenRoute } from '@/navigation/registry';
import { QuotationHistoryView } from './QuotationHistoryView';

const route: ScreenRoute = {
  id: '066',
  path: '/admin/quotes/history',
  roles: ['admin'],
  titleKey: 'quotationHistory.title',
  Component: QuotationHistoryView,
  tab: 'quotes',
};

export default route;
