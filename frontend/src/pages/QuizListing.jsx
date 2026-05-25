import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import { getCategoryEmoji, getDifficultyColor } from '../utils/helpers';
import { HiSearch, HiFilter } from 'react-icons/hi';
import '../styles/quiz.css';

const QuizListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [page, setPage] = useState(1);

  const categories = ['', 'Science', 'Mathematics', 'History', 'Geography', 'English', 'Technology', 'General Knowledge', 'Art & Music', 'Sports'];
  const difficulties = ['', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchQuizzes();
  }, [category, difficulty, page]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (difficulty) params.set('difficulty', difficulty);
      params.set('page', page);
      params.set('limit', 12);

      const res = await API.get(`/quizzes?${params.toString()}`);
      setQuizzes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuizzes();
  };

  return (
    <div className="quiz-listing-page" id="quiz-listing-page">
      <div className="container">
        <div className="quiz-listing-header animate-fadeIn">
          <h1>Explore <span className="gradient-text">Quizzes</span> 🎯</h1>
          <p>Find the perfect quiz to challenge yourself</p>
        </div>

        {/* Filters */}
        <div className="filters-bar glass-card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSearch} className="search-form">
            <HiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="quiz-search-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <div className="filter-selects">
            <div className="filter-select">
              <HiFilter />
              <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} id="category-filter">
                <option value="">All Categories</option>
                {categories.filter(c => c).map(c => <option key={c} value={c}>{getCategoryEmoji(c)} {c}</option>)}
              </select>
            </div>
            <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} id="difficulty-filter" className="filter-select-simple">
              <option value="">All Levels</option>
              {difficulties.filter(d => d).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <Loader text="Finding quizzes..." />
        ) : quizzes.length === 0 ? (
          <div className="empty-state animate-fadeIn">
            <span className="empty-emoji">🔍</span>
            <h3>No quizzes found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="quiz-grid animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {quizzes.map((quiz, idx) => (
                <Link to={`/quiz/${quiz._id}`} key={quiz._id} className="quiz-card glass-card" style={{ animationDelay: `${idx * 0.05}s` }}>
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
                  <span className="quiz-card-category">{quiz.category}</span>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
                <button className="btn btn-outline btn-sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizListing;
