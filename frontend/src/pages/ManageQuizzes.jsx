import { useState, useEffect } from 'react';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import { useToast } from '../components/common/Toast';
import { getCategoryEmoji, getDifficultyColor } from '../utils/helpers';
import { HiPlus, HiPencil, HiTrash, HiX, HiEye, HiEyeOff } from 'react-icons/hi';
import '../styles/admin.css';

const ManageQuizzes = () => {
  const { addToast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showQuestions, setShowQuestions] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [quizForm, setQuizForm] = useState({
    title: '', description: '', category: 'General Knowledge', difficulty: 'Easy', timeLimit: 300, isPublished: false
  });

  const [questionForm, setQuestionForm] = useState({
    questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', points: 10
  });

  const categories = ['Science', 'Mathematics', 'History', 'Geography', 'English', 'Technology', 'General Knowledge', 'Art & Music', 'Sports'];

  useEffect(() => { fetchQuizzes(); }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await API.get('/quizzes?limit=100');
      setQuizzes(res.data.data);
    } catch (err) {
      addToast('Failed to load quizzes', 'error');
    } finally { setLoading(false); }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await API.put(`/quizzes/${editingQuiz._id}`, quizForm);
        addToast('Quiz updated!', 'success');
      } else {
        await API.post('/quizzes', quizForm);
        addToast('Quiz created!', 'success');
      }
      setShowModal(false);
      setEditingQuiz(null);
      resetQuizForm();
      fetchQuizzes();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz and all its questions?')) return;
    try {
      await API.delete(`/quizzes/${id}`);
      addToast('Quiz deleted', 'success');
      fetchQuizzes();
    } catch (err) {
      addToast('Failed to delete quiz', 'error');
    }
  };

  const togglePublish = async (quiz) => {
    try {
      await API.put(`/quizzes/${quiz._id}`, { isPublished: !quiz.isPublished });
      addToast(quiz.isPublished ? 'Quiz unpublished' : 'Quiz published!', 'success');
      fetchQuizzes();
    } catch (err) {
      addToast('Failed to update quiz', 'error');
    }
  };

  const openEditQuiz = (quiz) => {
    setQuizForm({
      title: quiz.title, description: quiz.description, category: quiz.category,
      difficulty: quiz.difficulty, timeLimit: quiz.timeLimit, isPublished: quiz.isPublished
    });
    setEditingQuiz(quiz);
    setShowModal(true);
  };

  const resetQuizForm = () => {
    setQuizForm({ title: '', description: '', category: 'General Knowledge', difficulty: 'Easy', timeLimit: 300, isPublished: false });
  };

  // Question management
  const fetchQuestions = async (quizId) => {
    try {
      const res = await API.get(`/questions/quiz/${quizId}`);
      setQuestions(res.data.data);
      setShowQuestions(quizId);
    } catch (err) {
      addToast('Failed to load questions', 'error');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...questionForm, quiz: showQuestions };
      if (editingQuestion) {
        await API.put(`/questions/${editingQuestion._id}`, data);
        addToast('Question updated!', 'success');
      } else {
        await API.post('/questions', data);
        addToast('Question added!', 'success');
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      resetQuestionForm();
      fetchQuestions(showQuestions);
      fetchQuizzes();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await API.delete(`/questions/${id}`);
      addToast('Question deleted', 'success');
      fetchQuestions(showQuestions);
      fetchQuizzes();
    } catch (err) {
      addToast('Failed to delete question', 'error');
    }
  };

  const openEditQuestion = (q) => {
    setQuestionForm({
      questionText: q.questionText, options: [...q.options],
      correctAnswer: q.correctAnswer, explanation: q.explanation || '', points: q.points
    });
    setEditingQuestion(q);
    setShowQuestionModal(true);
  };

  const resetQuestionForm = () => {
    setQuestionForm({ questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', points: 10 });
  };

  const updateOption = (idx, value) => {
    const newOptions = [...questionForm.options];
    newOptions[idx] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  if (loading) return <Loader text="Loading quizzes..." />;

  return (
    <div className="admin-page" id="manage-quizzes-page">
      <div className="container">
        <div className="admin-header animate-fadeIn">
          <div>
            <h1>Manage <span className="gradient-text">Quizzes</span></h1>
            <p>{quizzes.length} total quizzes</p>
          </div>
          <button className="btn btn-primary" onClick={() => { resetQuizForm(); setEditingQuiz(null); setShowModal(true); }} id="create-quiz-btn">
            <HiPlus /> Create Quiz
          </button>
        </div>

        {/* Quiz List */}
        <div className="admin-table-card glass-card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(quiz => (
                <tr key={quiz._id}>
                  <td className="quiz-title-cell">
                    <span className="table-emoji">{getCategoryEmoji(quiz.category)}</span>
                    <div>
                      <strong>{quiz.title}</strong>
                      <span className="table-subtitle">{quiz.description?.substring(0, 50)}...</span>
                    </div>
                  </td>
                  <td>{quiz.category}</td>
                  <td><span className="badge" style={{ background: `${getDifficultyColor(quiz.difficulty)}20`, color: getDifficultyColor(quiz.difficulty) }}>{quiz.difficulty}</span></td>
                  <td>{quiz.totalQuestions}</td>
                  <td>
                    <button className={`status-toggle ${quiz.isPublished ? 'published' : ''}`} onClick={() => togglePublish(quiz)}>
                      {quiz.isPublished ? <><HiEye /> Published</> : <><HiEyeOff /> Draft</>}
                    </button>
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-sm btn-outline" onClick={() => fetchQuestions(quiz._id)} title="Manage Questions">📝</button>
                    <button className="btn btn-sm btn-outline" onClick={() => openEditQuiz(quiz)} title="Edit"><HiPencil /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteQuiz(quiz._id)} title="Delete"><HiTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Questions Panel */}
        {showQuestions && (
          <div className="questions-panel glass-card animate-fadeIn" id="questions-panel">
            <div className="questions-panel-header">
              <h2>Questions for: {quizzes.find(q => q._id === showQuestions)?.title}</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => { resetQuestionForm(); setEditingQuestion(null); setShowQuestionModal(true); }}>
                  <HiPlus /> Add Question
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setShowQuestions(null)}><HiX /></button>
              </div>
            </div>
            <div className="questions-list">
              {questions.length === 0 ? (
                <p className="no-questions">No questions yet. Add some!</p>
              ) : (
                questions.map((q, idx) => (
                  <div key={q._id} className="question-item">
                    <div className="question-item-header">
                      <span className="q-number">Q{idx + 1}</span>
                      <p>{q.questionText}</p>
                    </div>
                    <div className="question-options-preview">
                      {q.options.map((opt, i) => (
                        <span key={i} className={`option-preview ${i === q.correctAnswer ? 'correct' : ''}`}>
                          {String.fromCharCode(65 + i)}: {opt}
                        </span>
                      ))}
                    </div>
                    <div className="question-item-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => openEditQuestion(q)}><HiPencil /> Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteQuestion(q._id)}><HiTrash /> Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Quiz Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal glass-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><HiX /></button>
              </div>
              <form onSubmit={handleQuizSubmit} className="modal-form">
                <div className="input-group">
                  <label>Title</label>
                  <input value={quizForm.title} onChange={e => setQuizForm({...quizForm, title: e.target.value})} required placeholder="Quiz title" />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea value={quizForm.description} onChange={e => setQuizForm({...quizForm, description: e.target.value})} required placeholder="Quiz description" rows="3" />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Category</label>
                    <select value={quizForm.category} onChange={e => setQuizForm({...quizForm, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Difficulty</label>
                    <select value={quizForm.difficulty} onChange={e => setQuizForm({...quizForm, difficulty: e.target.value})}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Time Limit (seconds)</label>
                    <input type="number" value={quizForm.timeLimit} onChange={e => setQuizForm({...quizForm, timeLimit: parseInt(e.target.value)})} min="30" max="3600" />
                  </div>
                  <div className="input-group">
                    <label>Published</label>
                    <select value={quizForm.isPublished} onChange={e => setQuizForm({...quizForm, isPublished: e.target.value === 'true'})}>
                      <option value="false">Draft</option>
                      <option value="true">Published</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingQuiz ? 'Update Quiz' : 'Create Quiz'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="modal-overlay" onClick={() => setShowQuestionModal(false)}>
            <div className="modal glass-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingQuestion ? 'Edit Question' : 'Add Question'}</h2>
                <button className="modal-close" onClick={() => setShowQuestionModal(false)}><HiX /></button>
              </div>
              <form onSubmit={handleQuestionSubmit} className="modal-form">
                <div className="input-group">
                  <label>Question</label>
                  <textarea value={questionForm.questionText} onChange={e => setQuestionForm({...questionForm, questionText: e.target.value})} required placeholder="Enter the question" rows="2" />
                </div>
                {questionForm.options.map((opt, idx) => (
                  <div className="input-group" key={idx}>
                    <label>Option {String.fromCharCode(65 + idx)} {idx === questionForm.correctAnswer && '✅'}</label>
                    <input value={opt} onChange={e => updateOption(idx, e.target.value)} required placeholder={`Option ${String.fromCharCode(65 + idx)}`} />
                  </div>
                ))}
                <div className="form-row">
                  <div className="input-group">
                    <label>Correct Answer</label>
                    <select value={questionForm.correctAnswer} onChange={e => setQuestionForm({...questionForm, correctAnswer: parseInt(e.target.value)})}>
                      {[0,1,2,3].map(i => <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Points</label>
                    <input type="number" value={questionForm.points} onChange={e => setQuestionForm({...questionForm, points: parseInt(e.target.value)})} min="1" max="100" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Explanation (shown after quiz)</label>
                  <input value={questionForm.explanation} onChange={e => setQuestionForm({...questionForm, explanation: e.target.value})} placeholder="Why this answer is correct" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowQuestionModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingQuestion ? 'Update' : 'Add Question'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuizzes;
