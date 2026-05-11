import { useState } from 'react';
import { login, registerAuth, getMe, setStoredToken, getStoredToken } from '../services/demo.service';
import { normalizeApiError } from '../../../shared/utils/apiError';

export default function AuthDemo({ onTokenUpdate }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ nombres: '', email: '', password: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await login(loginForm);
      setStoredToken(res.token);
      onTokenUpdate(res.token);
      setResult({ type: 'success', data: res });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await registerAuth(registerForm);
      setResult({ type: 'success', data: res });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await getMe();
      setResult({ type: 'success', data: res });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-grid">
      <div className="demo-card">
        <h3>Login (Obtener Token)</h3>
        <form className="demo-form" onSubmit={handleLogin}>
          <label>Email <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} required /></label>
          <label>Password <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required /></label>
          <div className="demo-form-actions">
            <button type="submit" disabled={loading}>{loading ? 'Cargando...' : 'Login'}</button>
          </div>
        </form>
      </div>

      <div className="demo-card">
        <h3>Registrar Auth (Admin)</h3>
        <form className="demo-form" onSubmit={handleRegister}>
          <label>Nombres <input value={registerForm.nombres} onChange={e => setRegisterForm({...registerForm, nombres: e.target.value})} required /></label>
          <label>Email <input type="email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} required /></label>
          <label>Password <input type="password" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} required /></label>
          <div className="demo-form-actions">
            <button type="submit" disabled={loading}>{loading ? 'Cargando...' : 'Registrar'}</button>
          </div>
        </form>
      </div>

      <div className="demo-card" style={{ gridColumn: '1 / -1' }}>
        <h3>Mi Perfil (/auth/me)</h3>
        <div className="demo-form-actions" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
          <button onClick={handleGetMe} disabled={loading}>{loading ? 'Cargando...' : 'Obtener mi Perfil'}</button>
        </div>
        {result && (
          <div className={`demo-result-box ${result.type === 'error' ? 'error' : ''}`}>
            {JSON.stringify(result.data, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}
