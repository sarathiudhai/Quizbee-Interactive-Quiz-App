import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import { getMotivationalMessage, formatTime } from '../utils/helpers';
import { HiCheck, HiX } from 'react-icons/hi';
import '../styles/result.css';

const Result = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const res = await API.get('/results/my');
      const found = res.data.data.find(r => r._id === id);
      if (found) {
        // Need to fetch full result with question details
        // Use the result we have
        setResult(found);
      }
    } catch (err) {
      console.error('Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Calculating your score..." />;
  if (!result) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><h2>Result not found</h2><Link to="/home" className="btn btn-primary">Go Home</Link></div>;

  const percentage = Math.round((result.score / result.totalPoints) * 100);
  const { emoji, message } = getMotivationalMessage(percentage);

  return (
    <div className="result-page" id="result-page">
      <div className="container">
        <div className="result-hero animate-fadeIn">
          <div className="result-emoji">{emoji}</div>
          <h1>{message}</h1>
          <p className="result-subtitle">
            {result.quiz?.title || 'Quiz'} completed!
          </p>
        </div>

        {/* Score Circle */}
        <div className="score-section animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="score-circle-wrapper">
            <div className="score-circle">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-secondary)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={percentage >= 60 ? 'var(--success)' : percentage >= 40 ? 'var(--warning)' : 'var(--danger)'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 3.39} 339`}
                  transform="rotate(-90 60 60)"
                  className="score-progress"
                />
              </svg>
              <div className="score-value">
                <span className="score-percent">{percentage}%</span>
                <span className="score-label">Score</span>
              </div>
            </div>
          </div>

          <div className="score-stats">
            <div className="score-stat glass-card">
              <span className="score-stat-value" style={{ color: 'var(--success)' }}>{result.correctAnswers}</span>
              <span className="score-stat-label">Correct</span>
            </div>
            <div className="score-stat glass-card">
              <span className="score-stat-value" style={{ color: 'var(--danger)' }}>{result.wrongAnswers}</span>
              <span className="score-stat-label">Wrong</span>
            </div>
            <div className="score-stat glass-card">
              <span className="score-stat-value" style={{ color: 'var(--primary)' }}>{result.score}/{result.totalPoints}</span>
              <span className="score-stat-label">Points</span>
            </div>
            <div className="score-stat glass-card">
              <span className="score-stat-value" style={{ color: 'var(--accent)' }}>{formatTime(result.timeTaken)}</span>
              <span className="score-stat-label">Time Taken</span>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        {result.answers && result.answers.length > 0 && (
          <div className="answers-review animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <h2>Answer Review</h2>
            <div className="answers-list">
              {result.answers.map((answer, idx) => (
                <div key={idx} className={`answer-item glass-card ${answer.isCorrect ? 'correct' : 'wrong'}`}>
                  <div className="answer-header">
                    <span className="answer-number">Q{idx + 1}</span>
                    <span className={`answer-badge ${answer.isCorrect ? 'badge-success' : 'badge-danger'}`}>
                      {answer.isCorrect ? <><HiCheck /> Correct</> : <><HiX /> Wrong</>}
                    </span>
                  </div>
                  {answer.question?.questionText && (
                    <p className="answer-question">{answer.question.questionText}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="result-actions animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <Link to="/quizzes" className="btn btn-primary btn-lg">Try Another Quiz 🎯</Link>
          <Link to="/leaderboard" className="btn btn-outline btn-lg">View Leaderboard 🏆</Link>
          <Link to="/home" className="btn btn-outline btn-lg">Go Home 🏠</Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
