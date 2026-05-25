import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Loader from '../components/common/Loader';
import API from '../api/axios';
import { getCategoryEmoji, getDifficultyColor } from '../utils/helpers';
import { HiAcademicCap, HiTrendingUp, HiStar, HiClock } from 'react-icons/hi';
import '../styles/home.css';

const Home = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizRes, resultRes] = await Promise.all([
        API.get('/quizzes?limit=6'),
        API.get('/results/my')
      ]);
      setQuizzes(quizRes.data.data);
      setResults(resultRes.data.data);
    } catch (err) {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading your dashboard..." />;

  const categories = ['Science', 'Mathematics', 'History', 'Geography', 'English', 'Technology', 'General Knowledge', 'Art & Music', 'Sports'];
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const avgScore = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalPoints * 100), 0) / results.length) : 0;

  return (
    <div className="home-page" id="home-page">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section animate-fadeIn">
          <div className="welcome-text">
            <h1>Hello, <span className="gradient-text">{user?.name}</span>! 👋</h1>
            <p>Ready for another quiz adventure today?</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="stat-card glass-card">
            <div className="stat-card-icon" style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF' }}>
              <HiAcademicCap />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{user?.quizzesTaken || 0}</span>
              <span className="stat-card-label">Quizzes Taken</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
              <HiStar />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{totalScore}</span>
              <span className="stat-card-label">Total Score</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-card-icon" style={{ background: 'rgba(255,107,157,0.15)', color: '#FF6B9D' }}>
              <HiTrendingUp />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{avgScore}%</span>
              <span className="stat-card-label">Avg Score</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-card-icon" style={{ background: 'rgba(0,210,255,0.15)', color: '#00D2FF' }}>
              <HiClock />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{results.length}</span>
              <span className="stat-card-label">Attempts</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="section-block animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="section-title">
            <h2>Browse Categories</h2>
            <Link to="/quizzes" className="view-all-link">View All →</Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <Link to={`/quizzes?category=${cat}`} key={cat} className="category-chip glass-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                <span className="cat-emoji">{getCategoryEmoji(cat)}</span>
                <span className="cat-name">{cat}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Quizzes */}
        <div className="section-block animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="section-title">
            <h2>Recent Quizzes</h2>
            <Link to="/quizzes" className="view-all-link">View All →</Link>
          </div>
          <div className="quiz-grid">
            {quizzes.map((quiz, idx) => (
              <Link to={`/quiz/${quiz._id}`} key={quiz._id} className="quiz-card glass-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="quiz-card-header">
                  <span className="quiz-card-emoji">{getCategoryEmoji(quiz.category)}</span>
                  <span className="badge" style={{ background: `${getDifficultyColor(quiz.difficulty)}20`, color: getDifficultyColor(quiz.difficulty) }}>
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="quiz-card-title">{quiz.title}</h3>
                <p className="quiz-card-desc">{quiz.description}</p>
                <div className="quiz-card-meta">
                  <span>📝 {quiz.totalQuestions} questions</span>
                  <span>⏱️ {Math.floor(quiz.timeLimit / 60)} min</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
