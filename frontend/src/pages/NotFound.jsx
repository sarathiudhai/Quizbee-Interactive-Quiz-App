import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }} id="not-found-page">
      <div className="animate-fadeIn">
        <div style={{ fontSize: '6rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🐝</div>
        <h1 style={{ fontSize: '5rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Oops! Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', maxWidth: '400px' }}>
          The page you're looking for doesn't exist. The bee got lost! 🐝
        </p>
        <Link to="/" className="btn btn-primary btn-lg">Go Home 🏠</Link>
      </div>
    </div>
  );
};

export default NotFound;
