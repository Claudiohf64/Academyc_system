import { useState } from 'react';
import * as demoService from '../services/demo.service';

export default function StudentSection() {
  const [dni, setDni] = useState('');
  const [regForm, setRegForm] = useState({ dni: '', email: '', password: '', career_id: '', telefono: '', direccion: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleList = async () => {
    setLoading(true);
    try {
      const data = await demoService.listStudents();
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
      const data = await demoService.getStudentByDni(dni);
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
      const data = await demoService.registerStudentTransactional({...regForm, career_id: Number(regForm.career_id)});
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-section">
      <h3>2. Estudiantes & Matrículas</h3>
      <div className="demo-grid">
        <div className="demo-card">
          <h4>Consultas</h4>
          <button onClick={handleList} disabled={loading}>Listar Todos</button>
          <hr />
          <label>DNI: <input type="text" value={dni} onChange={e => setDni(e.target.value)} /></label>
          <button onClick={handleLookup} disabled={loading}>Buscar por DNI</button>
        </div>
        <div className="demo-card">
          <h4>Registro Transaccional (/enrollments/register)</h4>
          <form onSubmit={handleRegister} className="demo-form">
            <input placeholder="DNI" value={regForm.dni} onChange={e => setRegForm({...regForm, dni: e.target.value})} required />
            <input placeholder="Email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} required />
            <input placeholder="Password" type="password" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} required />
            <input placeholder="ID Carrera" value={regForm.career_id} onChange={e => setRegForm({...regForm, career_id: e.target.value})} required />
            <input placeholder="Teléfono" value={regForm.telefono} onChange={e => setRegForm({...regForm, telefono: e.target.value})} />
            <input placeholder="Dirección" value={regForm.direccion} onChange={e => setRegForm({...regForm, direccion: e.target.value})} />
            <button type="submit" disabled={loading}>Registrar Alumno</button>
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
