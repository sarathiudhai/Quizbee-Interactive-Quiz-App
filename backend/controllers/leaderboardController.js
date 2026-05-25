const Result = require('../models/Result');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Private
exports.getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          quizzesTaken: { $sum: 1 },
          avgScore: { $avg: '$score' },
          bestScore: { $max: '$score' }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          totalScore: 1,
          quizzesTaken: 1,
          avgScore: { $round: ['$avgScore', 1] },
          bestScore: 1,
          'user.name': 1,
          'user.email': 1,
          'user.avatar': 1
        }
      }
    ]);

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz-specific leaderboard
// @route   GET /api/leaderboard/quiz/:quizId
// @access  Private
exports.getQuizLeaderboard = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const mongoose = require('mongoose');

    const leaderboard = await Result.aggregate([
      { $match: { quiz: new mongoose.Types.ObjectId(req.params.quizId) } },
      { $sort: { score: -1, timeTaken: 1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          score: 1,
          totalPoints: 1,
          timeTaken: 1,
          correctAnswers: 1,
          completedAt: 1,
          'user.name': 1,
          'user.avatar': 1
        }
      }
    ]);

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};
