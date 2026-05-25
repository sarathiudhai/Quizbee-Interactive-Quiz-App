import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import '../styles/auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!name) errs.name = 'Name is required';
    else if (name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register(name, email, password);
      addToast(`Welcome to QuizBee, ${user.name}! 🎉`, 'success');
      navigate('/home');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-bg-shapes">
        <div className="auth-shape auth-shape-1"></div>
        <div className="auth-shape auth-shape-2"></div>
      </div>
      <div className="auth-container animate-fadeIn">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <span className="auth-bee">🐝</span>
            <h1>Join QuizBee!</h1>
            <p>Create your account and start learning</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="register-form">
            <div className="input-group">
              <label htmlFor="register-name">Full Name</label>
              <div className="input-with-icon">
                <HiUser className="input-icon" />
                <input type="text" id="register-name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="register-email">Email</label>
              <div className="input-with-icon">
                <HiMail className="input-icon" />
                <input type="email" id="register-email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="register-password">Password</label>
              <div className="input-with-icon">
                <HiLockClosed className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} id="register-password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="register-confirm-password">Confirm Password</label>
              <div className="input-with-icon">
                <HiLockClosed className="input-icon" />
                <input type="password" id="register-confirm-password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading} id="register-submit-btn">
              {loading ? 'Creating Account...' : 'Create Account 🎉'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
