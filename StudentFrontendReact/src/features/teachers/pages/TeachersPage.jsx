import { startTransition, useEffect, useMemo, useState } from 'react';
import { normalizeApiError } from '../utils/teachers.formatters';
import '../styles/teachers.css';
import {
  createTeacher,
  createTeacherFromDni,
  deleteTeacher,
  getTeacherById,
  getTeacherByCode,
  listTeachers,
  lookupDni,
  updateTeacher,
} from '../services/teachers.service';

const emptyTeacherForm = {
  cod_docente: '',
  dni: '',
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  celular: '',
  direccion: '',
};

const emptyDniForm = {
  cod_docente: '',
  dni: '',
  celular: '',
  direccion: '',
};

function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [modal, setModal] = useState({ type: '', title: '' });
  const [teachersState, setTeachersState] = useState({ loading: true, error: '' });
  const [dniForm, setDniForm] = useState(emptyDniForm);
  const [lookupForm, setLookupForm] = useState({ dni: '' });
  const [lookupResult, setLookupResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [deletingId, setDeletingId] = useState(null);

  const stats = useMemo(() => ({
      total: teachers.length,
      withPhone: teachers.filter((teacher) => teacher.celular).length,
      withAddress: teachers.filter((teacher) => teacher.direccion).length,
  }), [teachers]);

  async function refreshTeachers() {
    setTeachersState({ loading: true, error: '' });

    try {
      const payload = await listTeachers();
      startTransition(() => {
        setTeachers(Array.isArray(payload.data) ? payload.data : []);
      });
      setTeachersState({ loading: false, error: '' });
    } catch (error) {
      setTeachersState({ loading: false, error: normalizeApiError(error) });
    }
  }

  useEffect(() => {
    refreshTeachers();
  }, []);

  function resetModal() {
    setModal({ type: '', title: '' });
    setTeacherForm(emptyTeacherForm);
    setDniForm(emptyDniForm);
    setLookupForm({ dni: '', id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setEditingId(null);
    setSaving(false);
  }

  function openCreateModal() {
    setTeacherForm(emptyTeacherForm);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'create', title: 'Registrar Docente' });
  }

  function openCreateDniModal() {
    setDniForm(emptyDniForm);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'create-dni', title: 'Registrar docente por DNI' });
  }

  function openLookupDniModal() {
    setLookupForm({ dni: '', id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'lookup-dni', title: 'Consultar DNI' });
  }

  function openLookupCodeModal() {
    setLookupForm({ cod_docente: '', id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'lookup-cod_docente', title: 'Consultar Codigo docente' });
  }

  function openLookupIdModal() {
    setLookupForm({ dni: '', id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'lookup-id', title: 'Buscar docente por ID' });
  }
  function openEditModal(teacher) {
    setEditingId(teacher.id);
    setTeacherForm({
      cod_docente: teacher.cod_docente || '',
      dni: teacher.dni || '',
      nombres: teacher.nombres || '',
      apellido_paterno: teacher.apellido_paterno || '',
      apellido_materno: teacher.apellido_materno || '',
      celular: teacher.celular || '',
      direccion: teacher.direccion || '',
    });
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'edit', title: `Editar docente #${teacher.id}` });
  }

  function handleTeacherFormChange(event) {
    const { name, value } = event.target;
    setTeacherForm((current) => ({ ...current, [name]: value }));
  }

  function handleDniFormChange(event) {
    const { name, value } = event.target;
    setDniForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateTeacher(event) {
    event.preventDefault();
    setSaving(true);
    setFormMessage({ type: 'info', text: 'Registrando Docente...' });

    try {
      const payload = await createTeacher(teacherForm);
      setFormMessage({ type: 'success', text: payload.message || 'Docente registrado correctamente.' });
      await refreshTeachers();
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
    setFormMessage({ type: 'info', text: 'Registrando Docente desde API DNI...' });

    try {
      const payload = await createTeacherFromDni(dniForm);
      setFormMessage({ type: 'success', text: payload.message || 'Docente registrado correctamente.' });
      await refreshTeachers();
      resetModal();
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateTeacher(event) {
    event.preventDefault();
    setSaving(true);
    setFormMessage({ type: 'info', text: 'Actualizando estudiante...' });

    try {
      await updateTeacher(editingId, teacherForm);
      await refreshTeachers();
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

  async function handleLookupCode(event) {
    event.preventDefault();
    setSaving(true);
    setLookupResult(null);
    setFormMessage({ type: 'info', text: 'Buscando docente...' });

    try {
      const payload = await getTeacherByCode(lookupForm.cod_docente);
      setLookupResult(payload.data);
      setFormMessage({ type: 'success', text: 'Docente encontrado.' });
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
    setFormMessage({ type: 'info', text: 'Buscando docente...' });

    try {
      const payload = await getTeacherById(lookupForm.id);
      setLookupResult(payload.data);
      setFormMessage({ type: 'success', text: 'Docente encontrado.' });
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTeacher(teacher) {
    const confirmed = window.confirm(`Eliminar al docente ${teacher.nombres} ${teacher.apellido_paterno}?`);
    if (!confirmed) return;

    setDeletingId(teacher.id);

    try {
      await deleteTeacher(teacher.id);
      await refreshTeachers();
    } catch (error) {
      setTeachersState((current) => ({ ...current, error: normalizeApiError(error) }));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="shell module-shell teachers-page">
      <header className="module-header">
        <div>
          <p className="eyebrow">Modulo academico</p>
          <h1>Gestion de docentes</h1>
        </div>
        <aside className="module-meta">
          <span>Modulo activo</span>
          <strong>Docentes</strong>
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
            <h2>Registros de docentes</h2>
          </div>
          <div className="toolbar-actions">
            <button type="button" onClick={openCreateModal}>+ Nuevo</button>
            <button type="button" className="ghost-button" onClick={openCreateDniModal}>Nuevo por DNI</button>
            <button type="button" className="ghost-button" onClick={openLookupDniModal}>Consultar DNI</button>
            <button type="button" className="ghost-button" onClick={openLookupCodeModal}>Buscar Cod-Docente</button>
            <button type="button" className="ghost-button" onClick={openLookupIdModal}>Buscar ID</button>
            <button type="button" className="ghost-button" onClick={refreshTeachers}>Recargar</button>
          </div>
        </div>

        {teachersState.error ? <p className="feedback error">{teachersState.error}</p> : null}
        {teachersState.loading ? <p className="feedback info">Cargando docentes...</p> : null}

        <div className="table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Codigo de docente</th>
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
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.cod_docente}</td>
                  <td>{teacher.dni}</td>
                  <td>{teacher.nombres}</td>
                  <td>{teacher.apellido_paterno}</td>
                  <td>{teacher.apellido_materno}</td>
                  <td>{teacher.celular || 'No registrado'}</td>
                  <td>{teacher.direccion || 'No registrada'}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="success-button" onClick={() => openEditModal(teacher)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDeleteTeacher(teacher)}
                        disabled={deletingId === teacher.id}
                      >
                        {deletingId === teacher.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!teachersState.loading && !teachers.length ? (
                <tr>
                  <td colSpan="8" className="empty-state">No hay docentes registrados.</td>
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
              <form className="form-grid two-columns" onSubmit={modal.type === 'create' ? handleCreateTeacher : handleUpdateTeacher}>
                <label>
                  Codigo docente
                  <input name="cod_docente" value={teacherForm.cod_docente} onChange={handleTeacherFormChange} placeholder="12345678" maxLength="8" />
                </label>
                <label>
                  DNI
                  <input name="dni" value={teacherForm.dni} onChange={handleTeacherFormChange} placeholder="12345678" maxLength="8" />
                </label>
                <label>
                  Nombres
                  <input name="nombres" value={teacherForm.nombres} onChange={handleTeacherFormChange} placeholder="Ana Maria" />
                </label>
                <label>
                  Apellido paterno
                  <input name="apellido_paterno" value={teacherForm.apellido_paterno} onChange={handleTeacherFormChange} placeholder="Quispe" />
                </label>
                <label>
                  Apellido materno
                  <input name="apellido_materno" value={teacherForm.apellido_materno} onChange={handleTeacherFormChange} placeholder="Rojas" />
                </label>
                <label>
                  Telefono
                  <input name="celular" value={teacherForm.celular} onChange={handleTeacherFormChange} placeholder="999111222" />
                </label>
                <label>
                  Direccion
                  <input name="direccion" value={teacherForm.direccion} onChange={handleTeacherFormChange} placeholder="Jr. Arequipa 445" />
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
                  Codigo docente
                  <input name="cod_docente" value={dniForm.cod_docente} onChange={handleDniFormChange} placeholder="12345678" maxLength="8" />
                </label>
                <label>
                  DNI
                  <input name="dni" value={dniForm.dni} onChange={handleDniFormChange} placeholder="12345678" maxLength="8" />
                </label>
                <label>
                  Telefono
                  <input name="celular" value={dniForm.celular} onChange={handleDniFormChange} placeholder="987654321" />
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

            {modal.type === 'lookup-cod_docente' ? (
              <form className="form-grid" onSubmit={handleLookupCode}>
                <label>
                  Codigo docente
                  <input
                    value={lookupForm.cod_docente}
                    onChange={(event) => setLookupForm((current) => ({ ...current, cod_docente: event.target.value }))}
                    placeholder="1"
                  />
                </label>
                <button type="submit" disabled={saving}>Buscar</button>
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
                <p><strong>Codigo docente:</strong> {lookupResult.cod_docente || 'No aplica'}</p>
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

export default TeachersPage;
