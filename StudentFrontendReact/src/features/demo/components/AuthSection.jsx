import { useState } from 'react';
import * as demoService from '../services/demo.service';
import { setStoredToken } from '../../../shared/api/httpClient';

export default function AuthSection() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await demoService.login(credentials);
      if (res.token) {
        setStoredToken(res.token);
      }
      setResult({ type: 'success', data: res });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await demoService.getMe();
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-section">
      <h3>1. Autenticación</h3>
      <div className="demo-grid">
        <div className="demo-card">
          <h4>Login</h4>
          <form onSubmit={handleLogin} className="demo-form">
            <label>Email: <input type="email" value={credentials.email} onChange={e => setCredentials({...credentials, email: e.target.value})} required /></label>
            <label>Password: <input type="password" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} required /></label>
            <button type="submit" disabled={loading}>Iniciar Sesión</button>
          </form>
        </div>
        <div className="demo-card">
          <h4>Token & Perfil</h4>
          <button onClick={handleGetMe} disabled={loading}>Ver mi Perfil (/auth/me)</button>
          <button onClick={() => { setStoredToken(null); alert('Token eliminado'); }} className="danger-button">Cerrar Sesión (Borrar Token)</button>
        </div>
      </div>
      {result && (
        <pre className={`demo-result ${result.type}`}>
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
