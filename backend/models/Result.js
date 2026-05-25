const mongoose = require('mongoose');

const answerDetailSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedAnswer: {
    type: Number,
    required: true,
    min: -1, // -1 = unanswered
    max: 3
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz reference is required']
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  answers: [answerDetailSchema],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for leaderboard queries
resultSchema.index({ quiz: 1, score: -1 });
resultSchema.index({ user: 1, completedAt: -1 });
resultSchema.index({ score: -1 });

module.exports = mongoose.model('Result', resultSchema);
