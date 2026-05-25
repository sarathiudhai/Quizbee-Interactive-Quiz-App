/**
 * Format time in seconds to mm:ss display
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get difficulty badge color
 */
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return '#10B981';
    case 'Medium': return '#F59E0B';
    case 'Hard': return '#EF4444';
    default: return '#6C63FF';
  }
};

/**
 * Get category emoji
 */
export const getCategoryEmoji = (category) => {
  const emojis = {
    'Science': '🔬',
    'Mathematics': '🔢',
    'History': '📜',
    'Geography': '🌍',
    'English': '📚',
    'Technology': '💻',
    'General Knowledge': '💡',
    'Art & Music': '🎨',
    'Sports': '⚽'
  };
  return emojis[category] || '📝';
};

/**
 * Get motivational message based on score percentage
 */
export const getMotivationalMessage = (percentage) => {
  if (percentage === 100) return { emoji: '🏆', message: 'Perfect Score! You\'re a Quiz Champion!' };
  if (percentage >= 80) return { emoji: '🌟', message: 'Excellent! You\'re a Star Learner!' };
  if (percentage >= 60) return { emoji: '👏', message: 'Great Job! Keep Learning and Growing!' };
  if (percentage >= 40) return { emoji: '💪', message: 'Good Effort! Practice Makes Perfect!' };
  if (percentage >= 20) return { emoji: '📖', message: 'Keep Trying! Every Quiz Makes You Smarter!' };
  return { emoji: '🐝', message: 'Don\'t Give Up! The QuizBee Believes in You!' };
};

/**
 * Get rank suffix (1st, 2nd, 3rd, etc.)
 */
export const getRankSuffix = (rank) => {
  if (rank % 100 >= 11 && rank % 100 <= 13) return `${rank}th`;
  switch (rank % 10) {
    case 1: return `${rank}st`;
    case 2: return `${rank}nd`;
    case 3: return `${rank}rd`;
    default: return `${rank}th`;
  }
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
