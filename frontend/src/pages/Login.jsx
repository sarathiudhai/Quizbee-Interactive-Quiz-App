import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}! 🐝`, 'success');
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-bg-shapes">
        <div className="auth-shape auth-shape-1"></div>
        <div className="auth-shape auth-shape-2"></div>
      </div>
      <div className="auth-container animate-fadeIn">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <span className="auth-bee">🐝</span>
            <h1>Welcome Back!</h1>
            <p>Sign in to continue your quiz adventure</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="login-form">
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <div className="input-with-icon">
                <HiMail className="input-icon" />
                <input
                  type="email"
                  id="login-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-with-icon">
                <HiLockClosed className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading} id="login-submit-btn">
              {loading ? 'Signing In...' : 'Sign In 🚀'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
