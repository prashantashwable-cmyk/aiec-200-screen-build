import type { ScreenRoute } from '@/navigation/registry';
import { PricingConfigView } from './PricingConfigView';

const route: ScreenRoute = {
  id: '070',
  path: '/admin/quotes/pricing',
  roles: ['admin'],
  titleKey: 'pricingConfig.title',
  Component: PricingConfigView,
  tab: 'quotes',
};

export default route;
