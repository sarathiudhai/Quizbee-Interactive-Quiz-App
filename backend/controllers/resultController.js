const Result = require('../models/Result');
const Question = require('../models/Question');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// @desc    Submit quiz result
// @route   POST /api/results
// @access  Private
exports.submitResult = async (req, res, next) => {
  try {
    const { quiz, answers, timeTaken } = req.body;

    // Verify quiz exists
    const quizDoc = await Quiz.findById(quiz);
    if (!quizDoc) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get all questions for this quiz to calculate score
    const questions = await Question.find({ quiz });

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let totalPoints = 0;

    const processedAnswers = questions.map(q => {
      totalPoints += q.points;
      const userAnswer = answers.find(a => a.question === q._id.toString());
      const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : -1;
      const isCorrect = selectedAnswer === q.correctAnswer;

      if (isCorrect) {
        score += q.points;
        correctAnswers++;
      } else {
        wrongAnswers++;
      }

      return {
        question: q._id,
        selectedAnswer,
        isCorrect
      };
    });

    // Create result
    const result = await Result.create({
      user: req.user._id,
      quiz,
      score,
      totalPoints,
      correctAnswers,
      wrongAnswers,
      timeTaken,
      answers: processedAnswers
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { quizzesTaken: 1, totalScore: score }
    });

    // Populate for response
    const populatedResult = await Result.findById(result._id)
      .populate('quiz', 'title category')
      .populate('answers.question', 'questionText options correctAnswer explanation');

    res.status(201).json({ success: true, data: populatedResult });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's results
// @route   GET /api/results/my
// @access  Private
exports.getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title category difficulty image')
      .sort({ completedAt: -1 });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all results for a quiz
// @route   GET /api/results/quiz/:quizId
// @access  Admin
exports.getQuizResults = async (req, res, next) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate('user', 'name email avatar')
      .populate('quiz', 'title')
      .sort({ score: -1 });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all results (admin)
// @route   GET /api/results/all
// @access  Admin
exports.getAllResults = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await Result.countDocuments();
    const results = await Result.find()
      .populate('user', 'name email')
      .populate('quiz', 'title category')
      .sort({ completedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
