import { useState, useEffect } from 'react';
import { listStudents, deleteStudent } from '../services/demo.service';

export default function StudentsDemo() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await listStudents();
      setStudents(res.data || res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id) => {
    if(!confirm('¿Eliminar registro de alumno?')) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="demo-card" style={{width: '100%'}}>
      <div className="demo-section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h3>Base de Datos de Alumnos</h3>
          <p>Información detallada de los alumnos registrados en el sistema académico.</p>
        </div>
        <button className="ghost-button" onClick={fetchStudents} disabled={loading}>
          {loading ? 'Sincronizando...' : 'Refrescar'}
        </button>
      </div>

      <div className="table-wrapper">
        <table className="students-table" style={{width: '100%'}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alumno</th>
              <th>DNI</th>
              <th>Información de Contacto</th>
              <th>Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  <div style={{fontWeight: '600'}}>{s.nombres} {s.apellido_paterno} {s.apellido_materno}</div>
                </td>
                <td>{s.dni}</td>
                <td>
                  <div style={{display: 'flex', flexDirection: 'column', fontSize: '0.85rem'}}>
                    <span>📞 {s.telefono}</span>
                    <span style={{opacity: 0.6}}>🏠 {s.direccion}</span>
                  </div>
                </td>
                <td>
                  <button className="ghost-button" style={{color: 'var(--danger-color)'}} onClick={() => handleDelete(s.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && !loading && (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No hay alumnos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
