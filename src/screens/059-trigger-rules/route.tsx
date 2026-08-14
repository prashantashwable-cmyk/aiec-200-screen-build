import type { ScreenRoute } from '@/navigation/registry';
import { TriggerRulesView } from './TriggerRulesView';

const route: ScreenRoute = {
  id: '059',
  path: '/admin/comm/trigger-rules',
  roles: ['admin'],
  titleKey: 'triggerRules.title',
  Component: TriggerRulesView,
  tab: 'comm',
};

export default route;
