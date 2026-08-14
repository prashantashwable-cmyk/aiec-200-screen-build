import type { ScreenRoute } from '@/navigation/registry';
import { SequenceBuilderView } from './SequenceBuilderView';

const route: ScreenRoute = {
  id: '052',
  path: '/admin/comm/sequences',
  roles: ['admin'],
  titleKey: 'sequenceBuilder.title',
  Component: SequenceBuilderView,
  tab: 'comm',
};

export default route;
