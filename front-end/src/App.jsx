import { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/verify';
import SelectRole from './pages/SelectRole';
import SelfIntro from './pages/SelfIntro';
import Dashboard from './pages/Dashboard';
import DSAArena from './pages/DSAArena';
import MCQArena from './pages/MCQArena';
import QuestionBank from './pages/QuestionBank';
import ResumeAnalyser from './pages/ResumeAnalyser';
import Roadmap from './pages/Roadmap';
import api from './api/axios';

// ProtectedRoute: Ensures user is logged in. 
// If they don't have a role, they are redirected to /select-role.
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    api.get('/resources/skills')
      .then(res => {
        if (active) {
          setAuth(res.data); // { role: string | null }
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setAuth(null);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [location.pathname]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0f19', color: '#10b981', fontSize: '1.2rem', fontWeight: 600 }}>
        Loading CrackCamp...
      </div>
    );
  }

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (auth.role === null && location.pathname !== '/select-role') {
    return <Navigate to="/select-role" replace />;
  }

  if (auth.role !== null && location.pathname === '/select-role') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// PublicRoute: Redirects already logged-in users to /dashboard or /select-role.
function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    let active = true;
    api.get('/resources/skills')
      .then(res => {
        if (active) {
          setAuth(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setAuth(null);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0f19', color: '#10b981', fontSize: '1.2rem', fontWeight: 600 }}>
        Loading CrackCamp...
      </div>
    );
  }

  if (auth) {
    if (auth.role === null) {
      return <Navigate to="/select-role" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify" element={<PublicRoute><Verify /></PublicRoute>} />

      {/* Protected Career Routes */}
      <Route path="/select-role" element={<ProtectedRoute><SelectRole /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/self-intro" element={<ProtectedRoute><SelfIntro /></ProtectedRoute>} />
      <Route path="/dsa-arena" element={<ProtectedRoute><DSAArena /></ProtectedRoute>} />
      <Route path="/mcq" element={<ProtectedRoute><MCQArena /></ProtectedRoute>} />
      <Route path="/question-bank" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><ResumeAnalyser /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />

      {/* Default Fallback Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
