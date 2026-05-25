import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineMenu, HiOutlineX, HiSun, HiMoon } from 'react-icons/hi';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to={user ? (isAdmin ? '/admin' : '/home') : '/'} className="navbar-logo">
          <span className="logo-bee">🐝</span>
          <span className="logo-text">QuizBee</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {user && !isAdmin && (
            <>
              <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/quizzes" className={`nav-link ${isActive('/quizzes') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Quizzes</Link>
              <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Leaderboard</Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          )}
          {user && isAdmin && (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/admin/quizzes" className={`nav-link ${isActive('/admin/quizzes') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Quizzes</Link>
              <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Users</Link>
            </>
          )}

          <button className="theme-toggle" onClick={toggleTheme} id="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'light' ? <HiMoon size={20} /> : <HiSun size={20} />}
          </button>

          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">{user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout} id="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
