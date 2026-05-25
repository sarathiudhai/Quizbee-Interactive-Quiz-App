const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Science', 'Mathematics', 'History', 'Geography', 'English', 'Technology', 'General Knowledge', 'Art & Music', 'Sports'],
    default: 'General Knowledge'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  timeLimit: {
    type: Number,
    required: [true, 'Time limit is required'],
    min: [30, 'Time limit must be at least 30 seconds'],
    max: [3600, 'Time limit cannot exceed 3600 seconds'],
    default: 300 // 5 minutes
  },
  image: {
    type: String,
    default: ''
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for searching & filtering
quizSchema.index({ category: 1, difficulty: 1 });
quizSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Quiz', quizSchema);
