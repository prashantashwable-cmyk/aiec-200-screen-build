import type { ScreenRoute } from '@/navigation/registry';
import { MaintenanceBookingScreen } from './MaintenanceBookingView';

/** The customer's own booking of a maintenance visit or a non-urgent call-out: their cover up front, real slots, the technician named, and live arrival on the day. */
const route: ScreenRoute = { id: '178', path: '/maintenance/:ticketId?', roles: ['customer'], titleKey: 'maintenance.title', Component: MaintenanceBookingScreen, tab: 'home' };

export default route;
