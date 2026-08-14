import type { ScreenRoute } from '@/navigation/registry';
import { CaptureSpecView } from './CaptureSpecView';

const route: ScreenRoute = {
  id: '034',
  path: '/surveyor/capture/spec',
  roles: ['surveyor'],
  titleKey: 'captureSpec.title',
  Component: CaptureSpecView,
  tab: 'capture',
};

export default route;
