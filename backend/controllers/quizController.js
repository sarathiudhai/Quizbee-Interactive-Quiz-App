const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');

// @desc    Get all quizzes (with search, filter, pagination)
// @route   GET /api/quizzes
// @access  Private
exports.getQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 12 } = req.query;

    const query = {};

    // Only show published quizzes to students
    if (req.user.role === 'student') {
      query.isPublished = true;
    }

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: quizzes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Admin
exports.createQuiz = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    // Handle uploaded image
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const quiz = await Quiz.create(req.body);

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Admin
exports.updateQuiz = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz (and its questions & results)
// @route   DELETE /api/quizzes/:id
// @access  Admin
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Delete associated questions and results
    await Question.deleteMany({ quiz: req.params.id });
    await Result.deleteMany({ quiz: req.params.id });
    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz and associated data deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz stats for admin dashboard
// @route   GET /api/quizzes/stats/overview
// @access  Admin
exports.getQuizStats = async (req, res, next) => {
  try {
    const totalQuizzes = await Quiz.countDocuments();
    const publishedQuizzes = await Quiz.countDocuments({ isPublished: true });
    const totalAttempts = await Result.countDocuments();
    const categoryStats = await Quiz.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalQuizzes,
        publishedQuizzes,
        totalAttempts,
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};
