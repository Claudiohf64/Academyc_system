import { useState, useEffect } from 'react';
import { listTeachers, deleteTeacher } from '../services/demo.service';

export default function TeachersDemo() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await listTeachers();
      setTeachers(res.data || res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleDelete = async (id) => {
    if(!confirm('¿Eliminar docente?')) return;
    try {
      await deleteTeacher(id);
      fetchTeachers();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="demo-card" style={{width: '100%'}}>
      <div className="demo-section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h3>Cuerpo Docente Registrado</h3>
          <p>Listado de profesores con sus códigos autogenerados por el sistema.</p>
        </div>
        <button className="ghost-button" onClick={fetchTeachers} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar Lista'}
        </button>
      </div>

      <div className="table-wrapper">
        <table className="students-table" style={{width: '100%'}}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Docente</th>
              <th>DNI</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t.id}>
                <td><strong>{t.cod_docente}</strong></td>
                <td>{t.nombres} {t.apellido_paterno} {t.apellido_materno}</td>
                <td>{t.dni}</td>
                <td>
                  <div style={{display: 'flex', flexDirection: 'column', fontSize: '0.85rem'}}>
                    <span>📞 {t.celular}</span>
                    <span style={{opacity: 0.6}}>📍 {t.direccion}</span>
                  </div>
                </td>
                <td>
                  <button className="ghost-button" style={{color: 'var(--danger-color)'}} onClick={() => handleDelete(t.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && !loading && (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No hay docentes registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
