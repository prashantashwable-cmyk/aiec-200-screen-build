import type { ScreenRoute } from '@/navigation/registry';
import { CaptureConfirmView } from './CaptureConfirmView';

const route: ScreenRoute = {
  id: '036',
  path: '/surveyor/capture/confirm',
  roles: ['surveyor'],
  titleKey: 'captureConfirm.title',
  Component: CaptureConfirmView,
  tab: 'capture',
};

export default route;
