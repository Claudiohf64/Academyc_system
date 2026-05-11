import { useState } from 'react';
import * as demoService from '../services/demo.service';

export default function UserSection() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleList = async () => {
    setLoading(true);
    try {
      const data = await demoService.listUsers();
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-section">
      <h3>5. Usuarios (Base)</h3>
      <div className="demo-grid">
        <div className="demo-card">
          <h4>Gestión de Cuentas</h4>
          <button onClick={handleList} disabled={loading}>Listar Usuarios</button>
          <p><small>Nota: Requiere rol Admin. Puede devolver 404 si la ruta no está registrada en el backend.</small></p>
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
