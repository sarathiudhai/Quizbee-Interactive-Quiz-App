const express = require('express');
const router = express.Router();
const {
  getGlobalLeaderboard,
  getQuizLeaderboard
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getGlobalLeaderboard);
router.get('/quiz/:quizId', protect, getQuizLeaderboard);

module.exports = router;
