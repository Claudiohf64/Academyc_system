import { useState } from 'react';
import { loginUser, registerUser } from '../services/auth.service';
import { normalizeApiError } from '../../../shared/utils/apiError';
import '../styles/auth.css';

const emptyLoginForm = {
  email: '',
  password: '',
};

const emptyRegisterForm = {
  nombres: '',
  email: '',
  password: '',
};

function AuthPage({ initialError = '', onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [message, setMessage] = useState({ type: initialError ? 'error' : '', text: initialError });
  const [submitting, setSubmitting] = useState(false);

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterForm((current) => ({ ...current, [name]: value }));
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage({ type: 'info', text: 'Validando credenciales...' });

    try {
      const payload = await loginUser(loginForm);
      onAuthenticated(payload.data.user);
    } catch (error) {
      setMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage({ type: 'info', text: 'Registrando usuario...' });

    try {
      await registerUser(registerForm);
      setRegisterForm(emptyRegisterForm);
      setMode('login');
      setMessage({ type: 'success', text: 'Usuario registrado. Ahora puedes iniciar sesion.' });
    } catch (error) {
      setMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="session-screen">
      <section className="session-card auth-card">
        <div>
          <p className="eyebrow">SENATI full stack</p>
          <h1>Panel Academico</h1>
          <p className="hero-text">
            Inicia sesion para consumir estudiantes y, si tu rol es admin, administrar usuarios.
          </p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Opciones de autenticacion">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Iniciar sesion
          </button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Registrarse
          </button>
        </div>

        {mode === 'login' ? (
          <form className="form-grid" onSubmit={handleLoginSubmit}>
            <label>
              Email
              <input name="email" type="email" value={loginForm.email} onChange={handleLoginChange} placeholder="admin@test.com" />
            </label>
            <label>
              Password
              <input name="password" type="password" value={loginForm.password} onChange={handleLoginChange} placeholder="123456" />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        ) : (
          <form className="form-grid" onSubmit={handleRegisterSubmit}>
            <label>
              Nombres
              <input name="nombres" value={registerForm.nombres} onChange={handleRegisterChange} placeholder="Ana Maria" />
            </label>
            <label>
              Email
              <input name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} placeholder="ana@mail.com" />
            </label>
            <label>
              Password
              <input name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} placeholder="Minimo 6 caracteres" />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        )}

        {message.text ? <p className={`feedback ${message.type}`}>{message.text}</p> : null}
      </section>
    </main>
  );
}

export default AuthPage;
