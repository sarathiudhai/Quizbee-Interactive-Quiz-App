import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import { useToast } from '../components/common/Toast';
import { formatDate, getCategoryEmoji } from '../utils/helpers';
import { HiPencil, HiAcademicCap, HiStar, HiTrendingUp } from 'react-icons/hi';
import '../styles/profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await API.get('/results/my');
      setResults(res.data.data);
    } catch (err) {
      console.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await API.put('/users/profile', { name });
      updateUser(res.data.data);
      addToast('Profile updated!', 'success');
      setEditing(false);
    } catch (err) {
      addToast('Failed to update profile', 'error');
    }
  };

  if (loading) return <Loader text="Loading profile..." />;

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const avgPercentage = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalPoints * 100), 0) / results.length)
    : 0;

  return (
    <div className="profile-page" id="profile-page">
      <div className="container">
        <div className="profile-header animate-fadeIn">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              {editing ? (
                <div className="profile-edit-form">
                  <input value={name} onChange={(e) => setName(e.target.value)} className="profile-name-input" />
                  <div className="profile-edit-actions">
                    <button className="btn btn-primary btn-sm" onClick={handleUpdateProfile}>Save</button>
                    <button className="btn btn-outline btn-sm" onClick={() => { setEditing(false); setName(user?.name); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h1>{user?.name} <button className="edit-btn" onClick={() => setEditing(true)}><HiPencil /></button></h1>
                  <p className="profile-email">{user?.email}</p>
                  <span className="badge badge-info">{user?.role}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="profile-stats animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="profile-stat glass-card">
            <HiAcademicCap className="profile-stat-icon" style={{ color: '#6C63FF' }} />
            <span className="profile-stat-value">{user?.quizzesTaken || 0}</span>
            <span className="profile-stat-label">Quizzes Taken</span>
          </div>
          <div className="profile-stat glass-card">
            <HiStar className="profile-stat-icon" style={{ color: '#F59E0B' }} />
            <span className="profile-stat-value">{totalScore}</span>
            <span className="profile-stat-label">Total Score</span>
          </div>
          <div className="profile-stat glass-card">
            <HiTrendingUp className="profile-stat-icon" style={{ color: '#10B981' }} />
            <span className="profile-stat-value">{avgPercentage}%</span>
            <span className="profile-stat-label">Avg Score</span>
          </div>
        </div>

        <div className="quiz-history animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h2>Quiz History</h2>
          {results.length === 0 ? (
            <div className="empty-state">
              <span className="empty-emoji">📝</span>
              <h3>No quizzes taken yet</h3>
              <p>Start a quiz to see your history here!</p>
            </div>
          ) : (
            <div className="history-list">
              {results.map((result, idx) => (
                <div key={result._id} className="history-item glass-card">
                  <div className="history-emoji">{getCategoryEmoji(result.quiz?.category)}</div>
                  <div className="history-info">
                    <h3>{result.quiz?.title || 'Unknown Quiz'}</h3>
                    <span className="history-date">{formatDate(result.completedAt)}</span>
                  </div>
                  <div className="history-score">
                    <span className="history-score-value" style={{ color: (result.score / result.totalPoints * 100) >= 60 ? 'var(--success)' : 'var(--danger)' }}>
                      {Math.round(result.score / result.totalPoints * 100)}%
                    </span>
                    <span className="history-score-detail">{result.score}/{result.totalPoints}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
