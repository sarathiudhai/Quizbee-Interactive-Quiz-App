import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useToast } from '../components/common/Toast';
import Loader from '../components/common/Loader';
import { formatTime, getCategoryEmoji, getDifficultyColor } from '../utils/helpers';
import { HiClock, HiChevronLeft, HiChevronRight, HiCheck } from 'react-icons/hi';
import '../styles/quiz.css';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const fetchQuizData = async () => {
    try {
      const [quizRes, questionsRes] = await Promise.all([
        API.get(`/quizzes/${id}`),
        API.get(`/questions/quiz/${id}?attempt=true`)
      ]);
      setQuiz(quizRes.data.data);
      setQuestions(questionsRes.data.data);
      setTimeLeft(quizRes.data.data.timeLimit);
    } catch (err) {
      addToast('Failed to load quiz', 'error');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const selectAnswer = (questionId, answerIdx) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIdx }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const formattedAnswers = questions.map(q => ({
      question: q._id,
      selectedAnswer: answers[q._id] !== undefined ? answers[q._id] : -1
    }));

    try {
      const res = await API.post('/results', {
        quiz: id,
        answers: formattedAnswers,
        timeTaken
      });
      navigate(`/result/${res.data.data._id}`);
    } catch (err) {
      addToast('Failed to submit quiz', 'error');
      setSubmitting(false);
    }
  }, [answers, questions, id, startTime, submitting]);

  if (loading) return <Loader text="Preparing your quiz..." />;
  if (!quiz) return null;

  const progress = ((currentQ + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const isUrgent = timeLeft <= 30;

  // Pre-quiz start screen
  if (!started) {
    return (
      <div className="quiz-start-page" id="quiz-start-page">
        <div className="container">
          <div className="quiz-start-card glass-card animate-fadeIn">
            <span className="quiz-start-emoji">{getCategoryEmoji(quiz.category)}</span>
            <h1>{quiz.title}</h1>
            <p className="quiz-start-desc">{quiz.description}</p>
            <div className="quiz-start-info">
              <div className="info-item">
                <span className="info-label">Questions</span>
                <span className="info-value">{questions.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time Limit</span>
                <span className="info-value">{Math.floor(quiz.timeLimit / 60)} min</span>
              </div>
              <div className="info-item">
                <span className="info-label">Difficulty</span>
                <span className="info-value" style={{ color: getDifficultyColor(quiz.difficulty) }}>{quiz.difficulty}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value">{quiz.category}</span>
              </div>
            </div>
            <div className="quiz-start-rules">
              <h3>📋 Rules</h3>
              <ul>
                <li>Answer all questions before the timer runs out</li>
                <li>You can navigate between questions</li>
                <li>Unanswered questions will be marked as wrong</li>
                <li>Your score will be shown immediately after submission</li>
              </ul>
            </div>
            <button className="btn btn-primary btn-lg" onClick={startQuiz} id="start-quiz-btn">
              Start Quiz 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQ];

  return (
    <div className="quiz-attempt-page" id="quiz-attempt-page">
      <div className="container">
        {/* Quiz Header */}
        <div className="quiz-attempt-header">
          <div className="quiz-attempt-info">
            <h2>{quiz.title}</h2>
            <span className="question-counter">Question {currentQ + 1} of {questions.length}</span>
          </div>
          <div className={`quiz-timer ${isUrgent ? 'timer-urgent' : ''}`}>
            <HiClock />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Card */}
        <div className="question-card glass-card animate-fadeIn" key={currentQ}>
          <div className="question-number">Q{currentQ + 1}</div>
          <h3 className="question-text">{currentQuestion.questionText}</h3>

          <div className="options-grid">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-btn ${answers[currentQuestion._id] === idx ? 'selected' : ''}`}
                onClick={() => selectAnswer(currentQuestion._id, idx)}
                id={`option-${idx}`}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option}</span>
                {answers[currentQuestion._id] === idx && <HiCheck className="option-check" />}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-navigation">
          <button className="btn btn-outline" disabled={currentQ === 0} onClick={() => setCurrentQ(prev => prev - 1)}>
            <HiChevronLeft /> Previous
          </button>

          <div className="question-dots">
            {questions.map((q, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentQ ? 'active' : ''} ${answers[q._id] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQ(idx)}
                title={`Question ${idx + 1}`}
              />
            ))}
          </div>

          {currentQ === questions.length - 1 ? (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting} id="submit-quiz-btn">
              {submitting ? 'Submitting...' : `Submit (${answeredCount}/${questions.length})`}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrentQ(prev => prev + 1)}>
              Next <HiChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
