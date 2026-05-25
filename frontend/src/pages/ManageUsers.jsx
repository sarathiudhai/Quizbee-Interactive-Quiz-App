import { useState, useEffect } from 'react';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import { useToast } from '../components/common/Toast';
import { formatDate } from '../utils/helpers';
import { HiTrash, HiSearch } from 'react-icons/hi';
import '../styles/admin.css';

const ManageUsers = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => { fetchUsers(); }, [page]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const res = await API.get(`/users?${params.toString()}`);
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      addToast('Failed to load users', 'error');
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await API.delete(`/users/${id}`);
      addToast('User deleted', 'success');
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  if (loading) return <Loader text="Loading users..." />;

  return (
    <div className="admin-page" id="manage-users-page">
      <div className="container">
        <div className="admin-header animate-fadeIn">
          <div>
            <h1>Manage <span className="gradient-text">Users</span></h1>
            <p>{pagination.total || 0} total users</p>
          </div>
        </div>
        <div className="admin-search glass-card animate-fadeIn">
          <form onSubmit={handleSearch} className="search-form">
            <HiSearch className="search-icon" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>
        <div className="admin-table-card glass-card animate-fadeIn">
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Role</th><th>Quizzes</th><th>Score</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td className="user-name-cell"><div className="table-avatar">{u.name.charAt(0).toUpperCase()}</div><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}`}>{u.role}</span></td>
                  <td>{u.quizzesTaken}</td>
                  <td>{u.totalScore}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>{u.role !== 'admin' && <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id, u.name)}><HiTrash /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
            <button className="btn btn-outline btn-sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
