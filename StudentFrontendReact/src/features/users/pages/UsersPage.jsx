import { useEffect, useMemo, useState } from 'react';
import { normalizeApiError } from '../../../shared/utils/apiError';
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from '../services/users.service';
import '../styles/users.css';

const emptyUserForm = {
  nombres: '',
  email: '',
  password: '',
  role: 'user',
  activo: true,
};

function UsersPage({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [usersState, setUsersState] = useState({ loading: true, error: '' });
  const [modal, setModal] = useState({ type: '', title: '' });
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [lookupForm, setLookupForm] = useState({ id: '' });
  const [lookupResult, setLookupResult] = useState(null);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role === 'admin').length,
    active: users.filter((user) => user.activo).length,
  }), [users]);

  async function refreshUsers() {
    setUsersState({ loading: true, error: '' });

    try {
      const payload = await listUsers();
      setUsers(Array.isArray(payload.data) ? payload.data : []);
      setUsersState({ loading: false, error: '' });
    } catch (error) {
      setUsersState({ loading: false, error: normalizeApiError(error) });
    }
  }

  useEffect(() => {
    refreshUsers();
  }, []);

  function resetModal() {
    setModal({ type: '', title: '' });
    setUserForm(emptyUserForm);
    setLookupForm({ id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setEditingId(null);
    setSaving(false);
  }

  function openCreateModal() {
    setUserForm(emptyUserForm);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'create', title: 'Registrar usuario' });
  }

  function openLookupModal() {
    setLookupForm({ id: '' });
    setLookupResult(null);
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'lookup', title: 'Buscar usuario por ID' });
  }

  function openEditModal(user) {
    setEditingId(user.id);
    setUserForm({
      nombres: user.nombres || '',
      email: user.email || '',
      password: '',
      role: user.role || 'user',
      activo: Boolean(user.activo),
    });
    setFormMessage({ type: '', text: '' });
    setModal({ type: 'edit', title: `Editar usuario #${user.id}` });
  }

  function handleUserFormChange(event) {
    const { name, value, checked, type } = event.target;
    setUserForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    setSaving(true);
    setFormMessage({ type: 'info', text: 'Registrando usuario...' });

    try {
      await createUser(userForm);
      await refreshUsers();
      resetModal();
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateUser(event) {
    event.preventDefault();
    setSaving(true);
    setFormMessage({ type: 'info', text: 'Actualizando usuario...' });

    const payload = { ...userForm };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      await updateUser(editingId, payload);
      await refreshUsers();
      resetModal();
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleLookupUser(event) {
    event.preventDefault();
    setSaving(true);
    setLookupResult(null);
    setFormMessage({ type: 'info', text: 'Buscando usuario...' });

    try {
      const payload = await getUserById(lookupForm.id);
      setLookupResult(payload.data);
      setFormMessage({ type: 'success', text: 'Usuario encontrado.' });
    } catch (error) {
      setFormMessage({ type: 'error', text: normalizeApiError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser(user) {
    const confirmed = window.confirm(`Eliminar al usuario ${user.nombres}?`);
    if (!confirmed) return;

    setDeletingId(user.id);

    try {
      await deleteUser(user.id);
      await refreshUsers();
    } catch (error) {
      setUsersState((current) => ({ ...current, error: normalizeApiError(error) }));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="shell module-shell">
      <header className="module-header">
        <div>
          <p className="eyebrow">Modulo protegido</p>
          <h1>Gestion de usuarios</h1>
        </div>
        <aside className="module-meta">
          <span>Sesion</span>
          <strong>{currentUser.email}</strong>
          <small>{currentUser.role}</small>
        </aside>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total usuarios</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span>Administradores</span>
          <strong>{stats.admins}</strong>
        </article>
        <article className="stat-card">
          <span>Activos</span>
          <strong>{stats.active}</strong>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="crud-toolbar">
          <div>
            <h2>Registros de usuarios</h2>
          </div>
          <div className="toolbar-actions">
            <button type="button" onClick={openCreateModal}>+ Nuevo</button>
            <button type="button" className="ghost-button" onClick={openLookupModal}>Buscar ID</button>
            <button type="button" className="ghost-button" onClick={refreshUsers}>Recargar</button>
          </div>
        </div>

        {usersState.error ? <p className="feedback error">{usersState.error}</p> : null}
        {usersState.loading ? <p className="feedback info">Cargando usuarios...</p> : null}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombres}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-pill ${user.role}`}>{user.role}</span></td>
                  <td>{user.activo ? 'Si' : 'No'}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="success-button" onClick={() => openEditModal(user)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDeleteUser(user)}
                        disabled={deletingId === user.id || currentUser.id === user.id}
                      >
                        {deletingId === user.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!usersState.loading && !users.length ? (
                <tr>
                  <td colSpan="6" className="empty-state">No hay usuarios registrados.</td>
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
              <form className="form-grid two-columns" onSubmit={modal.type === 'create' ? handleCreateUser : handleUpdateUser}>
                <label>
                  Nombres
                  <input name="nombres" value={userForm.nombres} onChange={handleUserFormChange} placeholder="Juan Perez" />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={userForm.email} onChange={handleUserFormChange} placeholder="juan@mail.com" />
                </label>
                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    value={userForm.password}
                    onChange={handleUserFormChange}
                    placeholder={modal.type === 'edit' ? 'Dejar vacio para conservar' : 'Minimo 6 caracteres'}
                  />
                </label>
                <label>
                  Rol
                  <select name="role" value={userForm.role} onChange={handleUserFormChange}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </label>
                <label className="check-row full-width">
                  <input name="activo" type="checkbox" checked={userForm.activo} onChange={handleUserFormChange} />
                  Usuario activo
                </label>
                <div className="modal-actions full-width">
                  <button type="button" className="ghost-button" onClick={resetModal}>Cancelar</button>
                  <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            ) : null}

            {modal.type === 'lookup' ? (
              <form className="form-grid" onSubmit={handleLookupUser}>
                <label>
                  ID
                  <input
                    value={lookupForm.id}
                    onChange={(event) => setLookupForm({ id: event.target.value })}
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
                <p><strong>ID:</strong> {lookupResult.id}</p>
                <p><strong>Nombres:</strong> {lookupResult.nombres}</p>
                <p><strong>Email:</strong> {lookupResult.email}</p>
                <p><strong>Rol:</strong> {lookupResult.role}</p>
                <p><strong>Activo:</strong> {lookupResult.activo ? 'Si' : 'No'}</p>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default UsersPage;
