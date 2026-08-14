import type { ScreenRoute } from '@/navigation/registry';
import { CaptureContactView } from './CaptureContactView';

const route: ScreenRoute = {
  id: '033',
  path: '/surveyor/capture/contact',
  roles: ['surveyor'],
  titleKey: 'captureContact.title',
  Component: CaptureContactView,
  tab: 'capture',
};

export default route;
