import { useState, useEffect } from 'react';
import { listCourses, createCourse, updateCourse, listCareers } from '../services/demo.service';
import { normalizeApiError } from '../../../shared/utils/apiError';

export default function CoursesDemo() {
  const [courses, setCourses] = useState([]);
  const [careers, setCareers] = useState([]);
  const [selectedCareerId, setSelectedCareerId] = useState('all');
  
  const [form, setForm] = useState({ 
    career_id: '', nombre: '', creditos: 5, descripcion: '', activo: true,
    fecha_inicio: '', fecha_fin: '', dias: '', horario: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInitialData = async () => {
    try {
      const carRes = await listCareers();
      const carData = carRes.data || carRes || [];
      setCareers(carData);
      if (carData.length > 0 && !form.career_id) {
        setForm(f => ({...f, career_id: carData[0].id}));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourses = async () => {
    try {
      const apiFilters = {};
      if (selectedCareerId !== 'all') apiFilters.career_id = selectedCareerId;
      const crsRes = await listCourses(apiFilters);
      setCourses(crsRes.data || crsRes || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);
  useEffect(() => { fetchCourses(); }, [selectedCareerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = { ...form, career_id: Number(form.career_id), creditos: Number(form.creditos) };
      if (editingId) {
        const res = await updateCourse(editingId, payload);
        setResult({ type: 'success', data: res });
        setEditingId(null);
      } else {
        const res = await createCourse(payload);
        setResult({ type: 'success', data: res });
      }
      fetchCourses();
      setForm({ ...form, nombre: '', creditos: 5, descripcion: '', activo: true, fecha_inicio: '', fecha_fin: '', dias: '', horario: '' });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setForm({ 
      career_id: course.career_id, 
      nombre: course.nombre, 
      creditos: course.creditos, 
      descripcion: course.descripcion || '', 
      activo: course.activo,
      fecha_inicio: course.fecha_inicio || '',
      fecha_fin: course.fecha_fin || '',
      dias: course.dias || '',
      horario: course.horario || ''
    });
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="demo-grid">
      <div className="demo-card">
        <h3>{editingId ? `Editar Curso #${editingId}` : 'Configurar Nuevo Curso'}</h3>
        <div className="demo-card-content">
          <form className="demo-form" onSubmit={handleSubmit}>
            <label>Pertenencia a Carrera
              <select value={form.career_id} onChange={e => setForm({...form, career_id: e.target.value})} required>
                <option value="">Seleccione carrera</option>
                {careers.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </label>
            <label>Nombre del Curso <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required placeholder="Ej: Programación Orientada a Objetos" /></label>
            
            <div className="demo-flex-row">
              <label>Créditos <input type="number" value={form.creditos} onChange={e => setForm({...form, creditos: e.target.value})} required /></label>
              <label>Días de Clase <input value={form.dias} onChange={e => setForm({...form, dias: e.target.value})} placeholder="Lunes, Miércoles..." /></label>
            </div>
            
            <div className="demo-flex-row">
              <label>F. Inicio <input type="date" value={form.fecha_inicio} onChange={e => setForm({...form, fecha_inicio: e.target.value})} /></label>
              <label>F. Fin <input type="date" value={form.fecha_fin} onChange={e => setForm({...form, fecha_fin: e.target.value})} /></label>
            </div>
            
            <label>Horario Estipulado <input value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} placeholder="Ej: 19:00 - 21:00" /></label>
            <label>Información Adicional <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} /></label>
            
            <div className="demo-form-actions">
              {editingId && <button type="button" className="ghost-button" onClick={() => {setEditingId(null); setForm({...form, nombre: '', creditos: 5, descripcion: '', activo: true});}}>Cancelar</button>}
              <button type="submit" disabled={loading}>{loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear Curso')}</button>
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
        <h3>Listado Filtrado ({courses.length})</h3>
        <div className="demo-card-content">
          <label className="demo-form" style={{marginBottom: '1.5rem'}}>Filtrar por Carrera
            <select value={selectedCareerId} onChange={e => setSelectedCareerId(e.target.value)}>
              <option value="all">Todas las carreras</option>
              {careers.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </label>
          
          <ul className="demo-list">
            {courses.map(c => (
              <li key={c.id} className="demo-list-item">
                <div className="demo-list-item-content">
                  <h4>{c.nombre} <small>({c.creditos} crds)</small></h4>
                  <p><strong>Carrera:</strong> {c.career?.nombre || 'N/A'}</p>
                  <p style={{fontSize: '0.8rem'}}>🕒 {c.horario || 'Sin horario'} | 📅 {c.dias || 'Sin días'}</p>
                  <p style={{fontSize: '0.8rem', opacity: 0.6}}>Inicio: {c.fecha_inicio} | Fin: {c.fecha_fin}</p>
                </div>
                <div className="demo-list-item-actions">
                  <button className="ghost-button" onClick={() => handleEdit(c)}>Editar</button>
                </div>
              </li>
            ))}
            {courses.length === 0 && <p style={{textAlign: 'center', opacity: 0.5}}>No hay cursos en esta carrera.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
