import { useState } from 'react';
import * as demoService from '../services/demo.service';

export default function TeacherSection() {
  const [dni, setDni] = useState('');
  const [regForm, setRegForm] = useState({ dni: '', email: '', password: '', celular: '', direccion: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleList = async () => {
    setLoading(true);
    try {
      const data = await demoService.listTeachers();
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async () => {
    setLoading(true);
    try {
      const data = await demoService.getTeacherByDni(dni);
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await demoService.registerTeacherTransactional(regForm);
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-section">
      <h3>3. Docentes</h3>
      <div className="demo-grid">
        <div className="demo-card">
          <h4>Consultas</h4>
          <button onClick={handleList} disabled={loading}>Listar Todos</button>
          <hr />
          <label>DNI: <input type="text" value={dni} onChange={e => setDni(e.target.value)} /></label>
          <button onClick={handleLookup} disabled={loading}>Buscar por DNI</button>
        </div>
        <div className="demo-card">
          <h4>Contratación Transaccional (/teachers/register)</h4>
          <form onSubmit={handleRegister} className="demo-form">
            <input placeholder="DNI" value={regForm.dni} onChange={e => setRegForm({...regForm, dni: e.target.value})} required />
            <input placeholder="Email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} required />
            <input placeholder="Password" type="password" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} required />
            <input placeholder="Celular" value={regForm.celular} onChange={e => setRegForm({...regForm, celular: e.target.value})} />
            <input placeholder="Dirección" value={regForm.direccion} onChange={e => setRegForm({...regForm, direccion: e.target.value})} />
            <button type="submit" disabled={loading}>Registrar Docente</button>
          </form>
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
