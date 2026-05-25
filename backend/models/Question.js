const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz reference is required']
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [500, 'Question text cannot exceed 500 characters']
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(arr) {
        return arr.length === 4;
      },
      message: 'Exactly 4 options are required'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    default: '',
    maxlength: [300, 'Explanation cannot exceed 300 characters']
  },
  points: {
    type: Number,
    default: 10,
    min: [1, 'Points must be at least 1'],
    max: [100, 'Points cannot exceed 100']
  }
}, {
  timestamps: true
});

// Index for fast lookup by quiz
questionSchema.index({ quiz: 1 });

module.exports = mongoose.model('Question', questionSchema);
