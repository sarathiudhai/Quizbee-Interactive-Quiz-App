/**
 * Seed script to create default admin user
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@quizbee.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'QuizBee Admin',
      email: 'admin@quizbee.com',
      password: 'Admin@123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   Email: admin@quizbee.com`);
    console.log(`   Password: Admin@123`);
    console.log(`   Role: admin`);

    // Also seed some sample quizzes and questions for demo
    const Quiz = require('../models/Quiz');
    const Question = require('../models/Question');

    const sampleQuizzes = [
      {
        title: 'Solar System Adventure',
        description: 'Explore the wonders of our solar system! Test your knowledge about planets, stars, and space.',
        category: 'Science',
        difficulty: 'Easy',
        timeLimit: 300,
        isPublished: true,
        createdBy: admin._id,
        totalQuestions: 5
      },
      {
        title: 'Math Wizards Challenge',
        description: 'Are you a math wizard? Solve these fun math puzzles and prove your skills!',
        category: 'Mathematics',
        difficulty: 'Medium',
        timeLimit: 420,
        isPublished: true,
        createdBy: admin._id,
        totalQuestions: 5
      },
      {
        title: 'World History Explorer',
        description: 'Travel through time and discover fascinating facts about world history!',
        category: 'History',
        difficulty: 'Medium',
        timeLimit: 360,
        isPublished: true,
        createdBy: admin._id,
        totalQuestions: 5
      },
      {
        title: 'Geography Globe Trotter',
        description: 'How well do you know our planet? Test your geography knowledge!',
        category: 'Geography',
        difficulty: 'Easy',
        timeLimit: 300,
        isPublished: true,
        createdBy: admin._id,
        totalQuestions: 5
      },
      {
        title: 'Tech Titans Quiz',
        description: 'Dive into the world of technology! From coding to gadgets, test it all.',
        category: 'Technology',
        difficulty: 'Hard',
        timeLimit: 480,
        isPublished: true,
        createdBy: admin._id,
        totalQuestions: 5
      },
      {
        title: 'English Grammar Pro',
        description: 'Master the English language with these grammar and vocabulary questions!',
        category: 'English',
        difficulty: 'Easy',
        timeLimit: 300,
        isPublished: true,
        createdBy: admin._id,
        totalQuestions: 5
      }
    ];

    const createdQuizzes = await Quiz.insertMany(sampleQuizzes);
    console.log(`✅ ${createdQuizzes.length} sample quizzes created`);

    // Sample questions for each quiz
    const allQuestions = [];

    // Science Quiz Questions
    const scienceQuiz = createdQuizzes[0];
    allQuestions.push(
      { quiz: scienceQuiz._id, questionText: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 1, explanation: 'Mars is called the Red Planet due to iron oxide on its surface.', points: 10 },
      { quiz: scienceQuiz._id, questionText: 'What is the largest planet in our solar system?', options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'], correctAnswer: 2, explanation: 'Jupiter is the largest planet with a diameter of about 139,820 km.', points: 10 },
      { quiz: scienceQuiz._id, questionText: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correctAnswer: 1, explanation: 'There are 8 planets in our solar system since Pluto was reclassified.', points: 10 },
      { quiz: scienceQuiz._id, questionText: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswer: 2, explanation: 'Mercury is the closest planet to the Sun.', points: 10 },
      { quiz: scienceQuiz._id, questionText: 'What is the name of Earth\'s natural satellite?', options: ['Sun', 'Moon', 'Mars', 'Star'], correctAnswer: 1, explanation: 'The Moon is Earth\'s only natural satellite.', points: 10 }
    );

    // Math Quiz Questions
    const mathQuiz = createdQuizzes[1];
    allQuestions.push(
      { quiz: mathQuiz._id, questionText: 'What is 15 × 13?', options: ['185', '195', '175', '205'], correctAnswer: 1, explanation: '15 × 13 = 195', points: 10 },
      { quiz: mathQuiz._id, questionText: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correctAnswer: 2, explanation: '√144 = 12 because 12 × 12 = 144', points: 10 },
      { quiz: mathQuiz._id, questionText: 'If a triangle has angles of 60° and 80°, what is the third angle?', options: ['30°', '40°', '50°', '60°'], correctAnswer: 1, explanation: 'The sum of angles in a triangle is 180°. 180 - 60 - 80 = 40°', points: 10 },
      { quiz: mathQuiz._id, questionText: 'What is 25% of 200?', options: ['25', '40', '50', '75'], correctAnswer: 2, explanation: '25% of 200 = 0.25 × 200 = 50', points: 10 },
      { quiz: mathQuiz._id, questionText: 'What comes next in the sequence: 2, 6, 18, 54, ...?', options: ['108', '162', '72', '216'], correctAnswer: 1, explanation: 'Each number is multiplied by 3. 54 × 3 = 162', points: 10 }
    );

    // History Quiz Questions
    const historyQuiz = createdQuizzes[2];
    allQuestions.push(
      { quiz: historyQuiz._id, questionText: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'Abraham Lincoln', 'George Washington', 'John Adams'], correctAnswer: 2, explanation: 'George Washington served as the first U.S. President from 1789 to 1797.', points: 10 },
      { quiz: historyQuiz._id, questionText: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, explanation: 'World War II ended in 1945 with the surrender of Germany and Japan.', points: 10 },
      { quiz: historyQuiz._id, questionText: 'Which ancient civilization built the pyramids?', options: ['Romans', 'Greeks', 'Egyptians', 'Persians'], correctAnswer: 2, explanation: 'The ancient Egyptians built the famous pyramids as tombs for pharaohs.', points: 10 },
      { quiz: historyQuiz._id, questionText: 'Who discovered America in 1492?', options: ['Vasco da Gama', 'Christopher Columbus', 'Marco Polo', 'Ferdinand Magellan'], correctAnswer: 1, explanation: 'Christopher Columbus reached the Americas in 1492.', points: 10 },
      { quiz: historyQuiz._id, questionText: 'The Great Wall of China was built to protect against invasions from the...?', options: ['South', 'East', 'West', 'North'], correctAnswer: 3, explanation: 'The Great Wall was built to protect against invasions from the north.', points: 10 }
    );

    // Geography Quiz Questions
    const geoQuiz = createdQuizzes[3];
    allQuestions.push(
      { quiz: geoQuiz._id, questionText: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctAnswer: 2, explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.', points: 10 },
      { quiz: geoQuiz._id, questionText: 'Which continent is the Sahara Desert located on?', options: ['Asia', 'Africa', 'Australia', 'South America'], correctAnswer: 1, explanation: 'The Sahara Desert is located in northern Africa.', points: 10 },
      { quiz: geoQuiz._id, questionText: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], correctAnswer: 2, explanation: 'Tokyo is the capital city of Japan.', points: 10 },
      { quiz: geoQuiz._id, questionText: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctAnswer: 1, explanation: 'The Nile River is traditionally considered the longest river at about 6,650 km.', points: 10 },
      { quiz: geoQuiz._id, questionText: 'Mount Everest is located in which mountain range?', options: ['Andes', 'Alps', 'Himalayas', 'Rockies'], correctAnswer: 2, explanation: 'Mount Everest is part of the Himalayan mountain range.', points: 10 }
    );

    // Technology Quiz Questions
    const techQuiz = createdQuizzes[4];
    allQuestions.push(
      { quiz: techQuiz._id, questionText: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'], correctAnswer: 0, explanation: 'HTML stands for HyperText Markup Language.', points: 10 },
      { quiz: techQuiz._id, questionText: 'Who is the co-founder of Microsoft?', options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Jeff Bezos'], correctAnswer: 1, explanation: 'Bill Gates co-founded Microsoft with Paul Allen in 1975.', points: 10 },
      { quiz: techQuiz._id, questionText: 'What does CPU stand for?', options: ['Central Processing Unit', 'Central Program Utility', 'Computer Personal Unit', 'Central Processor Utility'], correctAnswer: 0, explanation: 'CPU stands for Central Processing Unit.', points: 10 },
      { quiz: techQuiz._id, questionText: 'Which programming language is known as the "language of the web"?', options: ['Python', 'Java', 'JavaScript', 'C++'], correctAnswer: 2, explanation: 'JavaScript is the primary programming language for web development.', points: 10 },
      { quiz: techQuiz._id, questionText: 'What year was the first iPhone released?', options: ['2005', '2006', '2007', '2008'], correctAnswer: 2, explanation: 'The first iPhone was released by Apple on June 29, 2007.', points: 10 }
    );

    // English Quiz Questions
    const englishQuiz = createdQuizzes[5];
    allQuestions.push(
      { quiz: englishQuiz._id, questionText: 'Which is a synonym for "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 1, explanation: '"Joyful" means feeling great happiness, similar to "happy".', points: 10 },
      { quiz: englishQuiz._id, questionText: 'What is the past tense of "run"?', options: ['Runned', 'Ran', 'Running', 'Runs'], correctAnswer: 1, explanation: 'The past tense of "run" is "ran".', points: 10 },
      { quiz: englishQuiz._id, questionText: 'Which sentence is grammatically correct?', options: ['She don\'t like it.', 'She doesn\'t likes it.', 'She doesn\'t like it.', 'She not like it.'], correctAnswer: 2, explanation: '"She doesn\'t like it" uses the correct negative form.', points: 10 },
      { quiz: englishQuiz._id, questionText: 'What is the plural of "child"?', options: ['Childs', 'Childrens', 'Children', 'Childes'], correctAnswer: 2, explanation: '"Children" is the irregular plural form of "child".', points: 10 },
      { quiz: englishQuiz._id, questionText: 'An adjective describes a...?', options: ['Verb', 'Noun', 'Adverb', 'Preposition'], correctAnswer: 1, explanation: 'An adjective is a word that describes or modifies a noun.', points: 10 }
    );

    await Question.insertMany(allQuestions);
    console.log(`✅ ${allQuestions.length} sample questions created`);

    console.log('\n🐝 QuizBee seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedAdmin();
