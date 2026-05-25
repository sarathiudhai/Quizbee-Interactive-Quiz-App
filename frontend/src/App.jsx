import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/common/Navbar';
import Loader from './components/common/Loader';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import QuizListing from './pages/QuizListing';
import QuizAttempt from './pages/QuizAttempt';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ManageQuizzes from './pages/ManageQuizzes';
import ManageUsers from './pages/ManageUsers';
import NotFound from './pages/NotFound';

// Styles
import './styles/index.css';

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/home" replace />;
  return children;
};

// Guest-only Route (redirect if already logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Loader />;
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/home'} replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Guest only */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Student */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><QuizListing /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><Result /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/quizzes" element={<ProtectedRoute adminOnly><ManageQuizzes /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
