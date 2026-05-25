const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizStats
} = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/auth');

// Multer config for quiz image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'quiz-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Stats route must come before /:id
router.get('/stats/overview', protect, adminOnly, getQuizStats);

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, adminOnly, upload.single('image'), createQuiz);

router.route('/:id')
  .get(protect, getQuiz)
  .put(protect, adminOnly, upload.single('image'), updateQuiz)
  .delete(protect, adminOnly, deleteQuiz);

module.exports = router;
