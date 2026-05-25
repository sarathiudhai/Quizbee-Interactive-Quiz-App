const express = require('express');
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/quiz/:quizId', protect, getQuestions);

router.route('/')
  .post(protect, adminOnly, createQuestion);

router.route('/:id')
  .put(protect, adminOnly, updateQuestion)
  .delete(protect, adminOnly, deleteQuestion);

module.exports = router;
