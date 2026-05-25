const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// @desc    Get questions for a quiz
// @route   GET /api/questions/quiz/:quizId
// @access  Private
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ quiz: req.params.quizId });

    // For students taking the quiz, shuffle questions and don't send correctAnswer
    if (req.user.role === 'student' && req.query.attempt === 'true') {
      const shuffled = questions.sort(() => Math.random() - 0.5);
      const sanitized = shuffled.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        points: q.points
      }));
      return res.status(200).json({ success: true, data: sanitized });
    }

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

// @desc    Add question to quiz
// @route   POST /api/questions
// @access  Admin
exports.createQuestion = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.body.quiz);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const question = await Question.create(req.body);

    // Update quiz totalQuestions count
    const count = await Question.countDocuments({ quiz: req.body.quiz });
    await Quiz.findByIdAndUpdate(req.body.quiz, { totalQuestions: count });

    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Admin
exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Admin
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const quizId = question.quiz;
    await Question.findByIdAndDelete(req.params.id);

    // Update quiz totalQuestions count
    const count = await Question.countDocuments({ quiz: quizId });
    await Quiz.findByIdAndUpdate(quizId, { totalQuestions: count });

    res.status(200).json({ success: true, message: 'Question deleted' });
  } catch (error) {
    next(error);
  }
};
