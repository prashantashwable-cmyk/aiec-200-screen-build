import type { ScreenRoute } from '@/navigation/registry';
import { QuotationPreviewView } from './QuotationPreviewView';

const route: ScreenRoute = {
  id: '064',
  path: '/admin/quotes/:quotationId/preview',
  roles: ['admin'],
  titleKey: 'quotationPreview.title',
  Component: QuotationPreviewView,
  tab: 'quotes',
};

export default route;
