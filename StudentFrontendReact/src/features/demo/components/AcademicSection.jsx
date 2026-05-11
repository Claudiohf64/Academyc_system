import { useState } from 'react';
import * as demoService from '../services/demo.service';

export default function AcademicSection() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleListCareers = async () => {
    setLoading(true);
    try {
      const data = await demoService.listCareers();
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleListCourses = async () => {
    setLoading(true);
    try {
      const data = await demoService.listCourses();
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-section">
      <h3>4. Académico (Carreras & Cursos)</h3>
      <div className="demo-grid">
        <div className="demo-card">
          <h4>Carreras</h4>
          <button onClick={handleListCareers} disabled={loading}>Listar Carreras</button>
        </div>
        <div className="demo-card">
          <h4>Cursos</h4>
          <button onClick={handleListCourses} disabled={loading}>Listar Cursos</button>
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
