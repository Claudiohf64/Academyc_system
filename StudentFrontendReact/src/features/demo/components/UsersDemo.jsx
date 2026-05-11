import { useState, useEffect } from 'react';
import { listUsers, createUser, getUser, updateUser, deleteUser } from '../services/demo.service';
import { normalizeApiError } from '../../../shared/utils/apiError';

export default function UsersDemo() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', role: 'student', is_active: true });
  const [editingId, setEditingId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await listUsers();
      setUsers(res.data || res || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      if (editingId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password; // Don't send empty password on update
        const res = await updateUser(editingId, payload);
        setResult({ type: 'success', data: res });
        setEditingId(null);
      } else {
        const res = await createUser(form);
        setResult({ type: 'success', data: res });
      }
      fetchUsers();
      setForm({ email: '', password: '', role: 'student', is_active: true });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ email: user.email, password: '', role: user.role, is_active: user.is_active });
    setResult(null);
  };

  const handleDelete = async (id) => {
    if(!confirm('¿Eliminar usuario?')) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await deleteUser(id);
      setResult({ type: 'success', data: res });
      fetchUsers();
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    if(!searchId) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await getUser(searchId);
      setResult({ type: 'success', data: res });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-grid">
      <div className="demo-card">
        <h3>{editingId ? `Editar Usuario #${editingId}` : 'Crear Usuario'}</h3>
        <div className="demo-card-content">
          <form className="demo-form" onSubmit={handleSubmit}>
            <label>Email <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></label>
            <label>Password {editingId && <small>(Dejar en blanco para no cambiar)</small>}
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editingId} />
            </label>
            <label>Rol
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} required>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem'}}>
              Activo <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
            </label>
            <div className="demo-form-actions">
              {editingId && <button type="button" className="ghost-button" onClick={() => {setEditingId(null); setForm({email:'', password:'', role:'student', is_active:true});}}>Cancelar</button>}
              <button type="submit" disabled={loading}>{loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}</button>
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
        <h3>Buscar y Listado</h3>
        <div className="demo-card-content">
          <div className="demo-flex-row" style={{marginBottom: '1rem'}}>
            <label className="demo-form">Buscar por ID
              <input value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="ID" />
            </label>
            <button className="demo-btn-inline" onClick={handleGetById} disabled={loading || !searchId}>Buscar</button>
            <button className="demo-btn-inline ghost-button" onClick={fetchUsers}>Recargar Todos</button>
          </div>
          
          <ul className="demo-list">
            {users.map(u => (
              <li key={u.id} className="demo-list-item">
                <div className="demo-list-item-content">
                  <h4>{u.email} <small>#{u.id}</small></h4>
                  <p>Rol: {u.role}</p>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem'}}>
                  <span className={`demo-badge ${u.is_active ? 'active' : 'inactive'}`}>{u.is_active ? 'Activo' : 'Inactivo'}</span>
                  <div className="demo-list-item-actions">
                    <button className="ghost-button" style={{padding: '0.2rem 0.5rem', fontSize: '0.8rem'}} onClick={() => handleEdit(u)}>Editar</button>
                    <button className="ghost-button" style={{padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--danger-color)'}} onClick={() => handleDelete(u.id)}>Del</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
