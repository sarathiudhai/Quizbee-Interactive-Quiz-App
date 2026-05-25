# 🐝 QuizBee: Interactive Quiz App for Young Minds

A modern, full-stack educational quiz platform built for young learners. Features interactive quizzes, timed challenges, leaderboards, and a beautiful UI with dark/light mode.

![QuizBee](https://img.shields.io/badge/QuizBee-Educational_Platform-6C63FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?style=flat-square&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)

---

## ✨ Features

### 🎓 Student Features
- Interactive homepage with stats dashboard
- Browse quizzes by **9 categories** with search & filter
- **Timed quiz** taking with countdown timer
- **Progress bar** and question navigation
- Instant **score calculation** with detailed results
- **Motivational messages** based on performance
- **Leaderboard** with podium display
- **Profile page** with quiz history
- 🌙 **Dark/Light mode** toggle

### 👨‍💼 Admin Features
- **Analytics dashboard** with user and quiz stats
- **CRUD for quizzes** (create, edit, delete)
- **CRUD for questions** (MCQ with 4 options)
- **Category-based** quiz organization
- **Difficulty levels** (Easy, Medium, Hard)
- **Publish/Draft** toggle for quizzes
- **User management** with search
- **Image upload** support for quizzes

### 🔐 Security
- **JWT authentication** (7-day expiry)
- **bcrypt** password hashing (12 rounds)
- **Role-based** access control (Admin/Student)
- **Protected routes** on both frontend and backend

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (Glassmorphism, Gradients, Animations) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| API | REST API |
| Icons | React Icons |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
Quizbee/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/      # Auth, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── uploads/        # Quiz images
│   ├── utils/          # Seed script
│   ├── server.js       # Entry point
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── api/        # Axios instance
│   │   ├── components/ # Reusable components
│   │   ├── context/    # Auth & Theme contexts
│   │   ├── pages/      # All page components
│   │   ├── styles/     # CSS stylesheets
│   │   ├── utils/      # Helper functions
│   │   └── App.jsx     # Main app with routing
│   └── index.html
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (local or Atlas)
- **npm** v9+

### 1. Clone the repository
```bash
cd /path/to/Quizbee
```

### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Configure environment (edit .env if needed)
# Default: mongodb://localhost:27017/quizbee

# Seed database with admin user + sample quizzes
npm run seed

# Start backend server
npm run dev
```

The backend runs on **http://localhost:5000**

### 3. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on **http://localhost:3000**

---

## 🔑 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quizbee.com | Admin@123 |

Students can register through the Sign Up page.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new student |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | List quizzes (search/filter) |
| GET | `/api/quizzes/:id` | Get single quiz |
| POST | `/api/quizzes` | Create quiz (Admin) |
| PUT | `/api/quizzes/:id` | Update quiz (Admin) |
| DELETE | `/api/quizzes/:id` | Delete quiz (Admin) |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions/quiz/:id` | Get quiz questions |
| POST | `/api/questions` | Add question (Admin) |
| PUT | `/api/questions/:id` | Update question (Admin) |
| DELETE | `/api/questions/:id` | Delete question (Admin) |

### Results & Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/results` | Submit quiz result |
| GET | `/api/results/my` | Get my results |
| GET | `/api/leaderboard` | Global leaderboard |

---

## 🎨 Design Features
- **Glassmorphism** cards with backdrop blur
- **Gradient** backgrounds and text
- **Animated** buttons, cards, and page transitions
- **Custom bee loader** animation
- **Toast notifications** with auto-dismiss
- **Responsive** design (mobile, tablet, desktop)
- **Dark/Light mode** with persistence
- **Google Fonts** (Poppins + Inter)

---

## 📄 License

This project is for educational purposes.

---

Made with ❤️ and 🐝 by QuizBee Team
