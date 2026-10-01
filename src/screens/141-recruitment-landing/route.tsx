import type { ScreenRoute } from '@/navigation/registry';
import { RecruitmentScreen } from './RecruitmentView';

const route: ScreenRoute = {
  id: '141',
  path: '/join',
  roles: 'public',
  titleKey: 'recruit.title',
  Component: RecruitmentScreen,
  chromeless: true,
};

export default route;
