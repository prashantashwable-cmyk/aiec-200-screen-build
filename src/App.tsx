import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@/navigation/AppShell';
import { HOME_PATH_BY_ROLE, screenRoutes } from '@/navigation/registry';
import type { ScreenRoute } from '@/navigation/registry';
import { useAccess } from '@/features/access/AccessContext';
import { useSession } from '@/session/SessionProvider';
import { EmptyState, LoadingState, Screen } from '@/design-system';
import { SettingsScreen } from '@/screens/_settings/SettingsScreen';
import { PendingApprovalScreen } from '@/screens/_pending/PendingApprovalScreen';
import { ModulePendingScreen } from '@/screens/_pending/ModulePendingScreen';

/**
 * Routing is assembled from the discovered screen registry. Public (chromeless)
 * screens render bare; everything else renders inside the role-aware shell,
 * behind a session check and a per-route role check.
 */

function RequireSession({ children }: { children: React.ReactNode }) {
  const { kind, user, restoring } = useSession();
  const location = useLocation();
  const { t } = useTranslation();

  // A stored session is still being rehydrated. Redirecting here would bounce
  // a signed-in user to the login screen on every refresh and every deep link.
  if (restoring) {
    return (
      <Screen width="narrow">
        <LoadingState label={t('state.loading')} variant="cards" rows={2} />
      </Screen>
    );
  }

  if (kind === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  // A real account with no role assigned yet waits here rather than landing on
  // someone else's home screen.
  if (user && user.status === 'pending_approval') {
    return <PendingApprovalScreen />;
  }
  return <>{children}</>;
}

function RoleGuard({
  route,
  children,
}: {
  route: Pick<ScreenRoute, 'id' | 'path' | 'roles'>;
  children: React.ReactNode;
}) {
  const { role } = useSession();
  const { canOpen } = useAccess();
  // Who may open a screen is decided centrally (192): the code's route table, then Admin's decisions for the role and for the person.
  if (route.roles !== 'public' && (!role || !canOpen(route))) {
    return <Navigate to={role ? HOME_PATH_BY_ROLE[role] : '/login'} replace />;
  }
  return <>{children}</>;
}

function NotFound() {
  const { t } = useTranslation();
  const { role } = useSession();
  return (
    <Screen width="narrow">
      <EmptyState
        title={t('notFound.title')}
        body={t('notFound.body')}
        actionLabel={t('notFound.home')}
        onAction={() => {
          window.location.href = role ? HOME_PATH_BY_ROLE[role] : '/login';
        }}
      />
    </Screen>
  );
}

export default function App() {
  const publicRoutes = screenRoutes.filter((r) => r.chromeless);
  const shellRoutes = screenRoutes.filter((r) => !r.chromeless);

  return (
    <Routes>
      {publicRoutes.map(({ id, path, Component }) => (
        <Route key={id} path={path} element={<Component />} />
      ))}

      <Route
        element={
          <RequireSession>
            <AppShell />
          </RequireSession>
        }
      >
        {shellRoutes.map(({ id, path, roles, Component }) => (
          <Route
            key={id}
            path={path}
            element={
              <RoleGuard route={{ id, path, roles }}>
                <Component />
              </RoleGuard>
            }
          />
        ))}

        {/* Foundation-owned screens, not part of the numbered 200. */}
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/supplier" element={<ModulePendingScreen role="supplier" moduleNumber={10} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
