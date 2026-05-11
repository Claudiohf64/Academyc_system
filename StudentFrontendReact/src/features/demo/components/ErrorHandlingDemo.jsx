import { useState } from 'react';
import { apiRequest } from '../../../shared/api/httpClient';
import { normalizeApiError } from '../../../shared/utils/apiError';

export default function ErrorHandlingDemo() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testError = async (endpoint, method = 'GET', body = null) => {
    setLoading(true);
    setResult(null);
    try {
      const options = { method };
      if (body) options.body = JSON.stringify(body);
      
      const res = await apiRequest(endpoint, options);
      setResult({ type: 'success', data: res });
    } catch (error) {
      setResult({ type: 'error', data: normalizeApiError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-card" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="demo-section-header">
        <h2>Pruebas de Manejo de Errores</h2>
        <p>Prueba diferentes escenarios de error del backend para ver cómo el frontend (<code>normalizeApiError</code>) los procesa.</p>
      </div>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
        <button onClick={() => testError('/auth/login', 'POST', { email: 'bad@email.com', password: 'bad' })} className="ghost-button" style={{border: '1px solid var(--primary-color)'}}>
          Test 401 Unauthorized (Credenciales Inválidas)
        </button>
        
        <button onClick={() => testError('/students', 'POST', {})} className="ghost-button" style={{border: '1px solid var(--primary-color)'}}>
          Test 400 Bad Request (Faltan campos requeridos / Validación)
        </button>
        
        <button onClick={() => testError('/careers/999999')} className="ghost-button" style={{border: '1px solid var(--primary-color)'}}>
          Test 404 Not Found (ID inexistente)
        </button>

        <button onClick={() => testError('/users')} className="ghost-button" style={{border: '1px solid var(--primary-color)'}}>
          Test 401/403 (Acceder a ruta protegida sin token o admin)
        </button>
        
        <button onClick={() => testError('/endpoint-inexistente')} className="ghost-button" style={{border: '1px solid var(--primary-color)'}}>
          Test Ruta Inexistente 
        </button>
      </div>

      {result && (
        <div className={`demo-result-box ${result.type === 'error' ? 'error' : ''}`}>
          <h4>{result.type === 'error' ? 'Error Capturado:' : 'Respuesta Exitosa:'}</h4>
          {JSON.stringify(result.data, null, 2)}
        </div>
      )}
    </div>
  );
}
