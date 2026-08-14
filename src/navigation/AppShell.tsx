import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/session/SessionProvider';
import { NAV_BY_ROLE } from './navConfig';
import { screenRoutes } from './registry';

/**
 * The role-aware shell. Bottom tab bar on a phone, left sidebar from 1024px —
 * the same navigation reflowed, not two different navigations.
 */
export function AppShell() {
  const { t } = useTranslation();
  const { role, isDemo, signOut } = useSession();
  const location = useLocation();

  const items = role ? NAV_BY_ROLE[role] : [];

  // Highlight by the route's declared tab, so a deep screen like
  // /admin/analytics/revenue still lights up the Analytics tab.
  const activeRoute = screenRoutes.find((r) => {
    if (r.path === location.pathname) return true;
    const pattern = new RegExp(`^${r.path.replace(/:[^/]+/g, '[^/]+')}$`);
    return pattern.test(location.pathname);
  });
  const activeTab = activeRoute?.tab;

  const isActive = (itemId: string, itemPath: string) =>
    activeTab ? activeTab === itemId : location.pathname === itemPath;

  return (
    <div className="shell">
      {isDemo && (
        <div className="shell__demo-banner" role="status">
          <span>{t('demo.banner')}</span>
          <button
            type="button"
            onClick={signOut}
            className="ds-btn ds-btn--quiet ds-btn--sm"
            style={{ minHeight: 28, color: 'inherit', textDecoration: 'underline' }}
          >
            {t('demo.exit')}
          </button>
        </div>
      )}

      <div className="shell__body">
        <nav className="shell__sidebar" aria-label={t('nav.menu')}>
          <div className="shell__brand">
            <span className="brand-shaft" aria-hidden="true">
              <span className="brand-shaft__floor brand-shaft__floor--lit" />
              <span className="brand-shaft__floor brand-shaft__floor--lit" />
              <span className="brand-shaft__floor" />
            </span>
            <span className="shell__brand-mark">{t('app.name')}</span>
          </div>
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className="shell__side-item"
              aria-current={isActive(item.id, item.path) ? 'page' : undefined}
            >
              {item.icon}
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
          <div className="shell__side-footer">
            <button type="button" className="ds-btn ds-btn--quiet ds-btn--block" onClick={signOut}>
              {t('action.signOut')}
            </button>
          </div>
        </nav>

        <main className="shell__main">
          <Outlet />
        </main>
      </div>

      <nav className="shell__tabbar" aria-label={t('nav.menu')}>
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className="shell__tab"
            aria-current={isActive(item.id, item.path) ? 'page' : undefined}
          >
            {item.icon}
            <span className="ds-nav__label">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
