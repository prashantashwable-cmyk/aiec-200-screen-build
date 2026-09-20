import type { ScreenRoute } from '@/navigation/registry';
import { ContractGeneratorView } from './ContractGeneratorView';

const route: ScreenRoute = {
  id: '075',
  path: '/admin/deals/:dealId/contract',
  roles: ['admin'],
  titleKey: 'contractGenerator.title',
  Component: ContractGeneratorView,
  tab: 'deals',
};

export default route;
