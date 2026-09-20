import type { ScreenRoute } from '@/navigation/registry';
import { EsignatureCaptureView } from './EsignatureCaptureView';

const route: ScreenRoute = {
  id: '076',
  path: '/admin/deals/:dealId/signature',
  roles: ['admin'],
  titleKey: 'esignatureCapture.title',
  Component: EsignatureCaptureView,
  tab: 'deals',
};

export default route;
