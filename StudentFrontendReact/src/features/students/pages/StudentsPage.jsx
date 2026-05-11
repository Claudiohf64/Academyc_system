import { startTransition, useEffect, useMemo, useState } from 'react';
import { normalizeApiError } from '../../../shared/utils/apiError';
import '../styles/students.css';

import {
  createStudent,
  createStudentFromDni,
  deleteStudent,
  getStudentById,
  listStudents,
  lookupDni,
  updateStudent,
} from '../services/students.service';

const emptyStudentForm = {
  dni: '',
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  telefono: '',
  direccion: '',
};

const emptyDniForm = {
  dni: '',
  telefono: '',
  direccion: '',
};

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [studentsState, setStudentsState] = useState({ loading: true, error: '' });
  const [modal, setModal] = useState({ type: '', title: '' });
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [dniForm, setDniForm] = useState(emptyDniForm);
  const [lookupForm, setLookupForm] = useState({ dni: '', id: '' });
  const [lookupResult, setLookupResult] = useState(null);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const stats = useMemo(() => ({
    total: students.length,
    withPhone: students.filter((student) => student.telefono).length,
    withAddress: students.filter((student) => student.direccion).length,
  }), [students]);

  async function refreshStudents() {
    setStudentsState({ loading: true, error: '' });

    try {
      const payload = await listStudents();
      startTransition(() => {
        setStudents(Array.isArray(payload.data) ? payload.data : []);
      });
      setStudentsState({ loading: false, error: '' });
    } catch (error) {
      setStudentsState({ loading: false, error: normalizeApiError(error) });
    }
  }

  useEffect(() => {
    refreshStudents();
  }, []);

  function resetModal() {
    setModal({ type: '', title: '' });
    setStudentForm(emptyStudentForm);
    setDniForm(emptyDniForm);
    setLookupForm({ dni: '', id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setEditingId(null);
    setSaving(false);
  }

  function openCreateModal() {
    setStudentForm(emptyStudentForm);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'create', title: 'Registrar estudiante' });
  }

  function openCreateDniModal() {
    setDniForm(emptyDniForm);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'create-dni', title: 'Registrar estudiante por DNI' });
  }

  function openLookupDniModal() {
    setLookupForm({ dni: '', id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'lookup-dni', title: 'Consultar DNI' });
  }

  function openLookupIdModal() {
    setLookupForm({ dni: '', id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'lookup-id', title: 'Buscar estudiante por ID' });
  }

  function openEditModal(student) {
    setEditingId(student.id);
    setStudentForm({
      dni: student.dni || '',
      nombres: student.nombres || '',
      apellido_paterno: student.apellido_paterno || '',
      apellido_materno: student.apellido_materno || '',
      telefono: student.telefono || '',
      direccion: student.direccion || '',
    });
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'edit', title: `Editar estudiante #${student.id}` });
  }

  function handleStudentFormChange(event) {
    const { name, value } = event.target;
    setStudentForm((current) => ({ ...current, [name]: value }));
  }

  function handleDniFormChange(event) {
    const { name, value } = event.target;
    setDniForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateStudent(event) {
    event.preventDefault();
    setSaving(true);
    setFormMessage({ type: 'info', text: 'Registrando estudiante...' });

    try {
      const payload = await createStudent(studentForm);
      setFormMessage({ type: 'success', text: payload.message || 'Estudiante registrado correctamente.' });
      await refreshStudents();
      resetModal();
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateFromDni(event) {
    event.preventDefault();
    setSaving(true);
    setFormMessage({ type: 'info', text: 'Registrando estudiante desde API DNI...' });

    try {
      const payload = await createStudentFromDni(dniForm);
      setFormMessage({ type: 'success', text: payload.message || 'Estudiante registrado correctamente.' });
      await refreshStudents();
      resetModal();
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateStudent(event) {
    event.preventDefault();
    setSaving(true);
    setFormMessage({ type: 'info', text: 'Actualizando estudiante...' });

    try {
      await updateStudent(editingId, studentForm);
      await refreshStudents();
      resetModal();
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleLookupDni(event) {
    event.preventDefault();
    setSaving(true);
    setLookupResult(null);
    setFormMessage({ type: 'info', text: 'Consultando DNI...' });

    try {
      const payload = await lookupDni(lookupForm.dni);
      setLookupResult(payload.data);
      setFormMessage({ type: 'success', text: 'Consulta realizada correctamente.' });
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleLookupId(event) {
    event.preventDefault();
    setSaving(true);
    setLookupResult(null);
    setFormMessage({ type: 'info', text: 'Buscando estudiante...' });

    try {
      const payload = await getStudentById(lookupForm.id);
      setLookupResult(payload.data);
      setFormMessage({ type: 'success', text: 'Estudiante encontrado.' });
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStudent(student) {
    const confirmed = window.confirm(`Eliminar al estudiante ${student.nombres} ${student.apellido_paterno}?`);
    if (!confirmed) return;

    setDeletingId(student.id);

    try {
      await deleteStudent(student.id);
      await refreshStudents();
    } catch (error) {
      setStudentsState((current) => ({ ...current, error: normalizeApiError(error) }));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="shell module-shell students-page">
      <header className="module-header">
        <div>
          <p className="eyebrow">Modulo academico</p>
          <h1>Gestion de estudiantes</h1>
        </div>
        <aside className="module-meta">
          <span>Modulo activo</span>
          <strong>Estudiantes</strong>
        </aside>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total registrados</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span>Con telefono</span>
          <strong>{stats.withPhone}</strong>
        </article>
        <article className="stat-card">
          <span>Con direccion</span>
          <strong>{stats.withAddress}</strong>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="crud-toolbar">
          <div>
            <h2>Registros de estudiantes</h2>
          </div>
          <div className="toolbar-actions">
            <button type="button" onClick={openCreateModal}>+ Nuevo</button>
            <button type="button" className="ghost-button" onClick={openCreateDniModal}>Nuevo por DNI</button>
            <button type="button" className="ghost-button" onClick={openLookupDniModal}>Consultar DNI</button>
            <button type="button" className="ghost-button" onClick={openLookupIdModal}>Buscar ID</button>
            <button type="button" className="ghost-button" onClick={refreshStudents}>Recargar</button>
          </div>
        </div>

        {studentsState.error ? <p className="feedback error">{studentsState.error}</p> : null}
        {studentsState.loading ? <p className="feedback info">Cargando estudiantes...</p> : null}

        <div className="table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Nombres</th>
                <th>Apellido paterno</th>
                <th>Apellido materno</th>
                <th>Telefono</th>
                <th>Direccion</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.dni}</td>
                  <td>{student.nombres}</td>
                  <td>{student.apellido_paterno}</td>
                  <td>{student.apellido_materno}</td>
                  <td>{student.telefono || 'No registrado'}</td>
                  <td>{student.direccion || 'No registrada'}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="success-button" onClick={() => openEditModal(student)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDeleteStudent(student)}
                        disabled={deletingId === student.id}
                      >
                        {deletingId === student.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!studentsState.loading && !students.length ? (
                <tr>
                  <td colSpan="8" className="empty-state">No hay estudiantes registrados.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {modal.type ? (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card" role="dialog" aria-modal="true" aria-label={modal.title}>
            <div className="modal-header">
              <h2>{modal.title}</h2>
              <button type="button" className="ghost-button" onClick={resetModal}>Cerrar</button>
            </div>

            {modal.type === 'create' || modal.type === 'edit' ? (
              <form className="form-grid two-columns" onSubmit={modal.type === 'create' ? handleCreateStudent : handleUpdateStudent}>
                <label>
                  DNI
                  <input name="dni" value={studentForm.dni} onChange={handleStudentFormChange} placeholder="12345678" maxLength="8" />
                </label>
                <label>
                  Nombres
                  <input name="nombres" value={studentForm.nombres} onChange={handleStudentFormChange} placeholder="Ana Maria" />
                </label>
                <label>
                  Apellido paterno
                  <input name="apellido_paterno" value={studentForm.apellido_paterno} onChange={handleStudentFormChange} placeholder="Quispe" />
                </label>
                <label>
                  Apellido materno
                  <input name="apellido_materno" value={studentForm.apellido_materno} onChange={handleStudentFormChange} placeholder="Rojas" />
                </label>
                <label>
                  Telefono
                  <input name="telefono" value={studentForm.telefono} onChange={handleStudentFormChange} placeholder="999111222" />
                </label>
                <label>
                  Direccion
                  <input name="direccion" value={studentForm.direccion} onChange={handleStudentFormChange} placeholder="Jr. Arequipa 445" />
                </label>
                <div className="modal-actions full-width">
                  <button type="button" className="ghost-button" onClick={resetModal}>Cancelar</button>
                  <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            ) : null}

            {modal.type === 'create-dni' ? (
              <form className="form-grid two-columns" onSubmit={handleCreateFromDni}>
                <label>
                  DNI
                  <input name="dni" value={dniForm.dni} onChange={handleDniFormChange} placeholder="12345678" maxLength="8" />
                </label>
                <label>
                  Telefono
                  <input name="telefono" value={dniForm.telefono} onChange={handleDniFormChange} placeholder="987654321" />
                </label>
                <label className="full-width">
                  Direccion
                  <input name="direccion" value={dniForm.direccion} onChange={handleDniFormChange} placeholder="Av. Los Proceres 123" />
                </label>
                <div className="modal-actions full-width">
                  <button type="button" className="ghost-button" onClick={resetModal}>Cancelar</button>
                  <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            ) : null}

            {modal.type === 'lookup-dni' ? (
              <form className="form-grid" onSubmit={handleLookupDni}>
                <label>
                  DNI
                  <input
                    value={lookupForm.dni}
                    onChange={(event) => setLookupForm((current) => ({ ...current, dni: event.target.value }))}
                    placeholder="12345678"
                    maxLength="8"
                  />
                </label>
                <button type="submit" disabled={saving}>Consultar</button>
              </form>
            ) : null}

            {modal.type === 'lookup-id' ? (
              <form className="form-grid" onSubmit={handleLookupId}>
                <label>
                  ID
                  <input
                    value={lookupForm.id}
                    onChange={(event) => setLookupForm((current) => ({ ...current, id: event.target.value }))}
                    placeholder="1"
                  />
                </label>
                <button type="submit" disabled={saving}>Buscar</button>
              </form>
            ) : null}

            {formMessage.text ? <p className={`feedback ${formMessage.type}`}>{formMessage.text}</p> : null}

            {lookupResult ? (
              <div className="result-card">
                <h3>Resultado</h3>
                <p><strong>ID:</strong> {lookupResult.id || 'No aplica'}</p>
                <p><strong>DNI:</strong> {lookupResult.dni}</p>
                <p><strong>Nombres:</strong> {lookupResult.nombres}</p>
                <p><strong>Apellido paterno:</strong> {lookupResult.apellido_paterno}</p>
                <p><strong>Apellido materno:</strong> {lookupResult.apellido_materno}</p>
                {lookupResult.nombre_completo ? <p><strong>Nombre completo:</strong> {lookupResult.nombre_completo}</p> : null}
                {lookupResult.telefono ? <p><strong>Telefono:</strong> {lookupResult.telefono}</p> : null}
                {lookupResult.direccion ? <p><strong>Direccion:</strong> {lookupResult.direccion}</p> : null}
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default StudentsPage;
