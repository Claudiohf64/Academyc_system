import { useEffect, useMemo, useState } from 'react';
import AuthPage from '../features/auth/pages/AuthPage';
import StudentsPage from '../features/students/pages/StudentsPage';
import TeachersPage from '../features/teachers/pages/TeachersPage';
import UsersPage from '../features/users/pages/UsersPage';
import DemoPage from '../features/demo/pages/DemoPage';
import { getAuthenticatedUser, logoutUser } from '../features/auth/services/auth.service';
import { getStoredToken } from '../shared/api/httpClient';
import { normalizeApiError } from '../shared/utils/apiError';

const views = {
  demo: {
    label: 'Demo Endpoints',
    description: 'Pruebas transaccionales y CRUDs',
  },
  students: {
    label: 'Estudiantes',
    description: 'CRUD academico y consulta por DNI',
  },
  teachers: {
    label: 'Docentes',
    description: 'CRUD academico y consulta por DNI',
  },
  users: {
    label: 'Usuarios',
    description: 'Administracion de accesos',
    adminOnly: true,
  },
};

function App() {
  const [authState, setAuthState] = useState({ loading: true, user: null, error: '' });
  const [activeView, setActiveView] = useState('students');
  const [menuOpen, setMenuOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return window.innerWidth > 980;
  });

  const availableViews = useMemo(() => {
    return Object.entries(views).filter(([, view]) => !view.adminOnly || authState.user?.role === 'admin');
  }, [authState.user]);

  async function restoreSession() {
    if (!getStoredToken()) {
      setAuthState({ loading: false, user: null, error: '' });
      return;
    }

    try {
      const payload = await getAuthenticatedUser();
      setAuthState({ loading: false, user: payload.data, error: '' });
    } catch (error) {
      logoutUser();
      setAuthState({ loading: false, user: null, error: normalizeApiError(error) });
    }
  }

  useEffect(() => {
    Promise.resolve().then(restoreSession);
  }, []);

  function handleAuthenticated(user) {
    setAuthState({ loading: false, user, error: '' });
    setActiveView('students');
  }

  function handleLogout() {
    logoutUser();
    setAuthState({ loading: false, user: null, error: '' });
    setActiveView('students');
    setMenuOpen(false);
  }

  function handleNavigate(viewKey) {
    setActiveView(viewKey);
  }

  if (authState.loading) {
    return (
      <main className="session-screen">
        <section className="session-card">
          <p className="eyebrow">SENATI full stack</p>
          <h1>Restaurando sesion</h1>
          <p className="hero-text">Validando el token guardado con el backend academico.</p>
        </section>
      </main>
    );
  }

  if (!authState.user) {
    return <AuthPage initialError={authState.error} onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className={menuOpen ? 'app-layout menu-open' : 'app-layout menu-collapsed'}>
      <header className="topbar">
        <button
          type="button"
          className="icon-button"
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="brand-block">
          <strong>Panel Academico</strong>
          <span>Backend DemoFullStck</span>
        </div>

        <div className="user-chip">
          <span>{authState.user.nombres}</span>
          <strong>{authState.user.role}</strong>
        </div>
      </header>

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-profile">
          <p className="eyebrow">Sesion activa</p>
          <h2>{authState.user.nombres}</h2>
          <p>{authState.user.email}</p>
        </div>

        <nav className="nav-list" aria-label="Modulos del sistema">
          {availableViews.map(([viewKey, view]) => (
            <button
              key={viewKey}
              type="button"
              className={activeView === viewKey ? 'nav-item active' : 'nav-item'}
              onClick={() => handleNavigate(viewKey)}
            >
              <span>{view.label}</span>
              <small>{view.description}</small>
            </button>
          ))}
        </nav>

        <button type="button" className="danger-button" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </aside>

      {menuOpen ? <button type="button" className="scrim" aria-label="Cerrar menu" onClick={() => setMenuOpen(false)} /> : null}

      <main className="content-area">
        {activeView === 'demo' ? <DemoPage currentUser={authState.user} /> : null}
        {activeView === 'teachers' ? <TeachersPage currentUser={authState.user} /> : null}
        {activeView === 'students' ? <StudentsPage currentUser={authState.user} /> : null}
        {activeView === 'users' && authState.user.role === 'admin' ? <UsersPage currentUser={authState.user} /> : null}
      </main>
    </div>
  );
}

export default App;
