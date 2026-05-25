const express = require('express');
const router = express.Router();
const {
  submitResult,
  getMyResults,
  getQuizResults,
  getAllResults
} = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, submitResult);
router.get('/my', protect, getMyResults);
router.get('/quiz/:quizId', protect, adminOnly, getQuizResults);
router.get('/all', protect, adminOnly, getAllResults);

module.exports = router;
