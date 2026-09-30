import type { ScreenRoute } from '@/navigation/registry';
import { CompletionScreen } from './CompletionView';

const route: ScreenRoute = {
  id: '140',
  path: '/handover-certificate/:jobId?',
  roles: ['admin', 'customer'],
  titleKey: 'completion.title',
  Component: CompletionScreen,
  tab: { admin: 'map', customer: 'installation' },
};

export default route;
