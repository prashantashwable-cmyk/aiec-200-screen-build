import type { ScreenRoute } from '@/navigation/registry';
import { AutoPoRulesView } from './AutoPoRulesView';

const route: ScreenRoute = {
  id: '094',
  path: '/admin/suppliers/po-rules',
  roles: ['admin'],
  titleKey: 'autoPoRules.title',
  Component: AutoPoRulesView,
  tab: 'suppliers',
};

export default route;
