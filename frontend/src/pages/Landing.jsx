import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiAcademicCap, HiLightningBolt, HiChartBar, HiUserGroup, HiStar, HiShieldCheck } from 'react-icons/hi';
import '../styles/landing.css';

const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="landing-page" id="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fadeIn">
            <span className="hero-badge">🐝 Welcome to QuizBee</span>
            <h1>Interactive Quiz App<br />for <span className="gradient-text">Young Minds</span></h1>
            <p className="hero-description">
              Make learning fun and exciting! Challenge yourself with colorful quizzes, 
              compete with friends, and watch your knowledge grow. 🚀
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <Link to={isAdmin ? '/admin' : '/home'} className="btn btn-primary btn-lg" id="hero-cta">
                  Go to Dashboard 🎯
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg" id="hero-signup-btn">
                    Get Started Free 🎉
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg" id="hero-login-btn">
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Quizzes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">9</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="hero-card-stack">
              <div className="floating-card card-1">
                <span>🔬</span>
                <p>Science</p>
              </div>
              <div className="floating-card card-2">
                <span>🔢</span>
                <p>Math</p>
              </div>
              <div className="floating-card card-3">
                <span>📜</span>
                <p>History</p>
              </div>
              <div className="floating-card card-4">
                <span>🌍</span>
                <p>Geography</p>
              </div>
              <div className="floating-card card-5">
                <span>💻</span>
                <p>Tech</p>
              </div>
              <div className="hero-center-bee">🐝</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features-section">
        <div className="container">
          <div className="section-header animate-fadeIn">
            <span className="section-badge">✨ Features</span>
            <h2>Why Students Love <span className="gradient-text">QuizBee</span></h2>
            <p>Discover what makes our platform the best choice for young learners</p>
          </div>
          <div className="features-grid">
            {[
              { icon: <HiAcademicCap />, title: 'Learn & Play', desc: 'Combine learning with fun through interactive quizzes designed for young minds.', color: '#6C63FF' },
              { icon: <HiLightningBolt />, title: 'Timed Challenges', desc: 'Race against the clock! Timed quizzes make learning exciting and competitive.', color: '#FF6B9D' },
              { icon: <HiChartBar />, title: 'Track Progress', desc: 'See your scores, track improvement, and celebrate your learning journey.', color: '#00D2FF' },
              { icon: <HiUserGroup />, title: 'Compete & Rank', desc: 'Climb the leaderboard, challenge friends, and become the Quiz Champion!', color: '#F59E0B' },
              { icon: <HiStar />, title: 'Multiple Categories', desc: 'From Science to History, explore quizzes across 9 exciting categories.', color: '#10B981' },
              { icon: <HiShieldCheck />, title: 'Safe & Secure', desc: 'A safe learning environment built for students with secure authentication.', color: '#8B5CF6' }
            ].map((feature, idx) => (
              <div className={`feature-card glass-card animate-fadeIn stagger-${idx + 1}`} key={idx}>
                <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card animate-fadeIn">
            <h2>Ready to Start Your <span className="gradient-text">Quiz Adventure</span>? 🚀</h2>
            <p>Join thousands of young minds who are learning while having fun!</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg" id="cta-signup-btn">
                Create Free Account 🐝
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-bee">🐝</span>
              <span className="logo-text gradient-text">QuizBee</span>
            </div>
            <p className="footer-text">Making learning fun for young minds © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
