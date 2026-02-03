import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { PersonaSelection } from './pages/PersonaSelection';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { Internships } from './pages/Internships';
import { Certificates } from './pages/Certificates';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Analytics } from './pages/Analytics';
import { CoursePlayer } from './pages/CoursePlayer';
import { HigherEdLanding } from './pages/HigherEdLanding';
import { SchoolLanding } from './pages/SchoolLanding';
import { ProfessionalLanding } from './pages/ProfessionalLanding';
import { Premium } from './pages/Premium';
import { QuizZone } from './pages/QuizZone';
import { UserProvider } from './context/UserContext';
import { CourseProvider } from './context/CourseContext';

const App: React.FC = () => {
  return (
    <UserProvider>
      <CourseProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Login is now the landing page */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/persona" element={<PersonaSelection />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/higher-ed" element={<HigherEdLanding />} />
              <Route path="/school" element={<SchoolLanding />} />
              <Route path="/professional" element={<ProfessionalLanding />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CoursePlayer />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/quiz-zone" element={<QuizZone />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </CourseProvider>
    </UserProvider>
  );
};

export default App;