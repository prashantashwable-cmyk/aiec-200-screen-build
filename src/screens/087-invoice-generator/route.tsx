import type { ScreenRoute } from '@/navigation/registry';
import { InvoiceGeneratorView } from './InvoiceGeneratorView';

const route: ScreenRoute = {
  id: '087',
  path: '/deals/:dealId/invoices',
  roles: ['admin', 'customer'],
  titleKey: 'invoiceGenerator.title',
  Component: InvoiceGeneratorView,
  tab: 'deals',
};

export default route;
