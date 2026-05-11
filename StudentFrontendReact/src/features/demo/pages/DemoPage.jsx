import AuthSection from '../components/AuthSection';
import StudentSection from '../components/StudentSection';
import TeacherSection from '../components/TeacherSection';
import AcademicSection from '../components/AcademicSection';
import UserSection from '../components/UserSection';
import '../styles/demo.css';

export default function DemoPage() {
  return (
    <div className="demo-container">
      <header className="demo-header">
        <h1>Dashboard de Pruebas API</h1>
        <p>Herramienta para verificar la conectividad y lógica del backend DemoFullStck.</p>
      </header>
      
      <main className="demo-main">
        <AuthSection />
        <StudentSection />
        <TeacherSection />
        <AcademicSection />
        <UserSection />
      </main>

      <footer className="demo-footer">
        <p>&copy; 2026 Instituto - Área de Desarrollo</p>
      </footer>
    </div>
  );
}
