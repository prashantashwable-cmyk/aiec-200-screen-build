import type { ScreenRoute } from '@/navigation/registry';
import { CaptureGpsView } from './CaptureGpsView';

const route: ScreenRoute = {
  id: '032',
  path: '/surveyor/capture',
  roles: ['surveyor'],
  titleKey: 'captureGps.title',
  Component: CaptureGpsView,
  tab: 'capture',
};

export default route;
