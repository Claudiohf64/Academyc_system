import { useState, useEffect } from 'react';
import { listEnrollments, updateEnrollmentStatus, deleteEnrollment, getEnrollment } from '../services/demo.service';
import { normalizeApiError } from '../../../shared/utils/apiError';

export default function EnrollmentsDemo() {
  const [enrollments, setEnrollments] = useState([]);
  const [filters, setFilters] = useState({ estado: 'all' });
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = async () => {
    try {
      const apiFilters = {};
      if (filters.estado !== 'all') apiFilters.estado = filters.estado;
      
      const res = await listEnrollments(apiFilters);
      setEnrollments(res.data || res || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchEnrollments(); }, [filters]);

  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await updateEnrollmentStatus(id, status);
      setResult({ type: 'success', data: res });
      fetchEnrollments();
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('¿Anular esta matrícula permanentemente?')) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await deleteEnrollment(id);
      setResult({ type: 'success', data: res });
      fetchEnrollments();
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if(!searchId) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await getEnrollment(searchId);
      setResult({ type: 'success', data: res });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-grid">
      <div className="demo-card" style={{ gridColumn: '1 / -1' }}>
        <div className="demo-section-header">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Gestión de Matrículas Académicas</h3>
            <button className="ghost-button" onClick={fetchEnrollments}>Actualizar Lista</button>
          </div>
          <p>Supervisión de registros de alumnos por programa. Permite cambiar estados de matrícula y anular registros.</p>
        </div>

        <div className="demo-flex-row" style={{marginBottom: '1.5rem', gap: '2rem'}}>
          <label className="demo-form">Filtrar por Estado
            <select value={filters.estado} onChange={e => setFilters({...filters, estado: e.target.value})}>
              <option value="all">Todas las matrículas</option>
              <option value="activa">Activas</option>
              <option value="completada">Completadas</option>
              <option value="anulada">Anuladas</option>
            </select>
          </label>
          <div className="demo-flex-row">
            <label className="demo-form">Buscar por ID
              <input value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="Ej: 1" />
            </label>
            <button className="demo-btn-inline" onClick={handleSearch} disabled={loading || !searchId}>Consultar</button>
          </div>
        </div>

        <div className="table-wrapper" style={{overflowX: 'auto'}}>
          <table className="students-table" style={{width: '100%', minWidth: '800px'}}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Alumno / DNI</th>
                <th>Carrera Destino</th>
                <th>Fecha Matrícula</th>
                <th>Estado Actual</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e.id}>
                  <td><strong>#{e.id}</strong></td>
                  <td>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span>{e.student?.nombres} {e.student?.apellido_paterno}</span>
                      <small style={{opacity: 0.6}}>DNI: {e.student?.dni}</small>
                    </div>
                  </td>
                  <td>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span>{e.career?.nombre || `Carrera ID: ${e.career_id}`}</span>
                      <small style={{opacity: 0.6}}>{e.career?.duracion_meses} meses</small>
                    </div>
                  </td>
                  <td>{new Date(e.fecha_matricula || e.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select 
                      value={e.estado} 
                      className={`demo-badge ${e.estado}`}
                      onChange={(ev) => handleUpdateStatus(e.id, ev.target.value)}
                      style={{
                        padding: '0.4rem', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      <option value="activa">ACTIVA</option>
                      <option value="completada">COMPLETADA</option>
                      <option value="anulada">ANULADA</option>
                    </select>
                  </td>
                  <td>
                    <button className="ghost-button" style={{color: 'var(--danger-color)'}} onClick={() => handleDelete(e.id)}>Anular</button>
                  </td>
                </tr>
              ))}
              {enrollments.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem', opacity: 0.5}}>No existen registros que coincidan con los criterios.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {result && (
           <div className={`demo-result-box ${result.type === 'error' ? 'error' : ''}`} style={{marginTop: '1.5rem'}}>
             {result.type === 'success' ? '✅ Acción realizada correctamente' : '❌ Error detectado'}
             {"\n"}
             {JSON.stringify(result.data, null, 2)}
           </div>
        )}
      </div>
    </div>
  );
}
