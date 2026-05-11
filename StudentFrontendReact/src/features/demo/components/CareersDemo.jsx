import { useState, useEffect } from 'react';
import { listCareers, createCareer, updateCareer, deleteCareer } from '../services/demo.service';
import { normalizeApiError } from '../../../shared/utils/apiError';

export default function CareersDemo() {
  const [careers, setCareers] = useState([]);
  const [filters, setFilters] = useState({ nombre: '', activo: 'all' });
  const [form, setForm] = useState({ nombre: '', duracion_meses: 36, descripcion: '', activo: true });
  const [editingId, setEditingId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCareers = async () => {
    try {
      const apiFilters = {};
      if (filters.nombre) apiFilters.nombre = filters.nombre;
      if (filters.activo !== 'all') apiFilters.activo = filters.activo === 'true';
      
      const res = await listCareers(apiFilters);
      setCareers(res.data || res || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchCareers(); }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = { ...form, duracion_meses: Number(form.duracion_meses) };
      if(editingId) {
        const res = await updateCareer(editingId, payload);
        setResult({ type: 'success', data: res });
        setEditingId(null);
      } else {
        const res = await createCareer(payload);
        setResult({ type: 'success', data: res });
      }
      fetchCareers();
      setForm({ nombre: '', duracion_meses: 36, descripcion: '', activo: true });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (career) => {
    setEditingId(career.id);
    setForm({ nombre: career.nombre, duracion_meses: career.duracion_meses || 36, descripcion: career.descripcion || '', activo: career.activo });
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="demo-grid">
      <div className="demo-card">
        <h3>{editingId ? `Editar Carrera #${editingId}` : 'Crear Nueva Carrera'}</h3>
        <div className="demo-card-content">
          <form className="demo-form" onSubmit={handleSubmit}>
            <label>Nombre de la Carrera <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required placeholder="Ej: Ingeniería de Sistemas" /></label>
            <label>Duración Estimada (Meses) <input type="number" value={form.duracion_meses} onChange={e => setForm({...form, duracion_meses: e.target.value})} required /></label>
            <label>Descripción Académica <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required /></label>
            <label style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem'}}>
              Carrera Activa <input type="checkbox" checked={form.activo} onChange={e => setForm({...form, activo: e.target.checked})} />
            </label>
            <div className="demo-form-actions">
              {editingId && <button type="button" className="ghost-button" onClick={() => {setEditingId(null); setForm({nombre:'', duracion_meses: 36, descripcion:'', activo:true});}}>Cancelar</button>}
              <button type="submit" disabled={loading}>{loading ? 'Guardando...' : (editingId ? 'Actualizar Carrera' : 'Registrar Carrera')}</button>
            </div>
          </form>
          {result && (
            <div className={`demo-result-box ${result.type === 'error' ? 'error' : ''}`}>
              {JSON.stringify(result.data, null, 2)}
            </div>
          )}
        </div>
      </div>

      <div className="demo-card">
        <h3>Listado y Filtros ({careers.length})</h3>
        <div className="demo-card-content">
          <div className="demo-flex-row" style={{marginBottom: '1.5rem'}}>
            <label className="demo-form">Buscar por nombre
              <input value={filters.nombre} onChange={e => setFilters({...filters, nombre: e.target.value})} placeholder="Filtro..." />
            </label>
            <label className="demo-form">Estado
              <select value={filters.activo} onChange={e => setFilters({...filters, activo: e.target.value})}>
                <option value="all">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </label>
          </div>
          
          <ul className="demo-list">
            {careers.map(c => (
              <li key={c.id} className="demo-list-item">
                <div className="demo-list-item-content">
                  <h4>{c.nombre} <small>({c.duracion_meses} meses)</small></h4>
                  <p>{c.descripcion}</p>
                </div>
                <div className="demo-list-item-actions" style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                  <span className={`demo-badge ${c.activo ? 'active' : 'inactive'}`}>{c.activo ? 'Activo' : 'Inactivo'}</span>
                  <button className="ghost-button" onClick={() => handleEdit(c)}>Editar</button>
                </div>
              </li>
            ))}
            {careers.length === 0 && <p style={{textAlign: 'center', opacity: 0.5}}>No se encontraron carreras.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
