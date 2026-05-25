import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import { HiUserGroup, HiCollection, HiClipboardList, HiTrendingUp } from 'react-icons/hi';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [userRes, quizRes] = await Promise.all([
        API.get('/users/stats/dashboard'),
        API.get('/quizzes/stats/overview')
      ]);
      setStats(userRes.data.data);
      setQuizStats(quizRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading admin dashboard..." />;

  return (
    <div className="admin-page" id="admin-dashboard">
      <div className="container">
        <div className="admin-header animate-fadeIn">
          <h1>Admin <span className="gradient-text">Dashboard</span> 🐝</h1>
          <p>Manage your QuizBee platform</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="admin-stat-card glass-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF' }}>
              <HiUserGroup />
            </div>
            <div>
              <span className="admin-stat-value">{stats?.totalUsers || 0}</span>
              <span className="admin-stat-label">Total Students</span>
            </div>
          </div>
          <div className="admin-stat-card glass-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
              <HiCollection />
            </div>
            <div>
              <span className="admin-stat-value">{quizStats?.totalQuizzes || 0}</span>
              <span className="admin-stat-label">Total Quizzes</span>
            </div>
          </div>
          <div className="admin-stat-card glass-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(255,107,157,0.15)', color: '#FF6B9D' }}>
              <HiClipboardList />
            </div>
            <div>
              <span className="admin-stat-value">{quizStats?.totalAttempts || 0}</span>
              <span className="admin-stat-label">Quiz Attempts</span>
            </div>
          </div>
          <div className="admin-stat-card glass-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(0,210,255,0.15)', color: '#00D2FF' }}>
              <HiTrendingUp />
            </div>
            <div>
              <span className="admin-stat-value">{stats?.newUsersThisWeek || 0}</span>
              <span className="admin-stat-label">New This Week</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-actions animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <Link to="/admin/quizzes" className="action-card glass-card">
              <span className="action-emoji">📝</span>
              <h3>Manage Quizzes</h3>
              <p>Create, edit, and delete quizzes and questions</p>
            </Link>
            <Link to="/admin/users" className="action-card glass-card">
              <span className="action-emoji">👥</span>
              <h3>Manage Users</h3>
              <p>View, edit, and manage student accounts</p>
            </Link>
          </div>
        </div>

        {/* Category Distribution */}
        {quizStats?.categoryStats && (
          <div className="category-chart animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <h2>Quizzes by Category</h2>
            <div className="category-bars glass-card">
              {quizStats.categoryStats.map((cat, idx) => {
                const maxCount = Math.max(...quizStats.categoryStats.map(c => c.count));
                const percentage = (cat.count / maxCount) * 100;
                return (
                  <div key={cat._id} className="category-bar-item">
                    <div className="category-bar-label">
                      <span>{cat._id}</span>
                      <span className="category-bar-count">{cat.count}</span>
                    </div>
                    <div className="category-bar-track">
                      <div className="category-bar-fill" style={{ width: `${percentage}%`, animationDelay: `${idx * 0.1}s` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Users */}
        {stats?.recentUsers && stats.recentUsers.length > 0 && (
          <div className="recent-users animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <h2>Recent Signups</h2>
            <div className="recent-users-list glass-card">
              {stats.recentUsers.map(u => (
                <div key={u._id} className="recent-user-item">
                  <div className="recent-user-avatar">{u.name.charAt(0).toUpperCase()}</div>
                  <div className="recent-user-info">
                    <span className="recent-user-name">{u.name}</span>
                    <span className="recent-user-email">{u.email}</span>
                  </div>
                  <span className="recent-user-date">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
