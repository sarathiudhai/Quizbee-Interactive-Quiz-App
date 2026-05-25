# 🐝 QuizBee: Interactive Quiz App for Young Minds

A modern, full-stack educational quiz platform built for young learners. Features interactive quizzes, timed challenges, leaderboards, and a beautiful UI with dark/light mode.

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

## 🔑 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quizbee.com | Admin@123 |

Students can register through the Sign Up page.

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

