# Task Manager - Full Stack Application

A modern, feature-rich task management application with React frontend, Node.js/Express backend, MongoDB database, and JWT authentication. Ready for Vercel deployment!

## 🚀 Features

### User Management
- ✅ User registration and login
- ✅ JWT-based secure authentication
- ✅ Profile management with real data
- ✅ User dashboard with personalized welcome

### Task Management
- ✅ Full CRUD operations for tasks
- ✅ Task priority levels (low, medium, high)
- ✅ Task status tracking (todo, in-progress, done)
- ✅ Due dates and reminders
- ✅ Task tags and categorization
- ✅ Time tracking (estimated vs actual)
- ✅ Recurring tasks support

### User Interface
- ✅ Modern, responsive design
- ✅ Dark/Light theme support
- ✅ Drag and drop functionality
- ✅ Kanban board view
- ✅ Calendar view
- ✅ Task list view
- ✅ Real-time statistics and charts
- ✅ Progress tracking and achievements

### Advanced Features
- ✅ Real-time data synchronization
- ✅ Task statistics and analytics
- ✅ Productivity insights
- ✅ Achievement system
- ✅ Search and filtering
- ✅ Bulk operations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Radix UI** - Accessible components
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Deployment
- **Vercel** - Frontend deployment
- **MongoDB Atlas** - Cloud database
- **Environment variables** - Secure configuration

## 📁 Project Structure

```
Task Manager/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React context providers
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # Utility functions
│   │   └── App.tsx            # Main App component
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── vercel.json           # Frontend deployment config
├── server/                     # Node.js backend
│   ├── models/                # Mongoose models
│   │   ├── User.js           # User schema
│   │   └── Task.js           # Task schema
│   ├── routes/                # Express routes
│   │   ├── auth.js           # Authentication routes
│   │   └── tasks.js          # Task management routes
│   ├── middleware/            # Custom middleware
│   │   └── auth.js           # JWT authentication
│   ├── index.js              # Main server file
│   ├── package.json          # Backend dependencies
│   └── vercel.json          # Backend deployment config
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   NODE_ENV=development
   ```

4. **Start the application**
   
   For development:
   ```bash
   # Start server (port 5000)
   cd server
   npm run dev
   
   # Start client (port 8080)
   cd ../client
   npm run dev
   ```

   Or use the root script:
   ```bash
   npm run dev
   ```

## 🌐 Vercel Deployment

### Automatic Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect both frontend and backend
   - Set environment variables in Vercel dashboard

### Environment Variables for Production

In Vercel dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_production_jwt_secret_key
NODE_ENV=production
```

### Manual Deployment

1. **Deploy Backend**
   ```bash
   cd server
   vercel --prod
   ```

2. **Deploy Frontend**
   ```bash
   cd client
   vercel --prod
   ```

## 📊 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user info |

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all user tasks |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/stats` | Get task statistics |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Request Examples

**Register User:**
```javascript
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Create Task:**
```javascript
POST /api/tasks
{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "tags": ["project", "urgent"]
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String (optional),
  status: String (enum: ['todo', 'in-progress', 'done']),
  priority: String (enum: ['low', 'medium', 'high']),
  dueDate: Date (optional),
  tags: [String],
  estimatedTime: Number (minutes),
  actualTime: Number (minutes),
  recurring: Object,
  user: ObjectId (ref: 'User'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🎯 Features in Detail

### Dashboard
- Personalized welcome message
- Task statistics overview
- Recent activity feed
- Progress charts
- Achievement badges

### Task Management
- Create, read, update, delete tasks
- Multiple view modes (list, kanban, calendar)
- Drag and drop functionality
- Bulk operations
- Advanced filtering and search

### Profile Management
- View and edit user information
- Task statistics per user
- Achievement levels
- Account settings

### Analytics
- Task completion rates
- Productivity trends
- Time tracking insights
- Performance metrics

## 🔧 Development

### Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:server       # Start only backend
npm run dev:client       # Start only frontend

# Building
npm run build            # Build for production
npm run build:client     # Build frontend only
npm run build:server     # Build backend only

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint             # Run ESLint
```

### Code Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Git Hooks** - Pre-commit checks

## 🚀 Performance Optimizations

- **Code Splitting** - Lazy loaded components
- **Image Optimization** - Optimized assets
- **Caching** - Browser and server caching
- **Bundle Optimization** - Minified production builds
- **Database Indexing** - Optimized queries

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Server-side validation
- **CORS Configuration** - Secure cross-origin requests
- **Environment Variables** - Secure configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🎉 Acknowledgments

- React team for the amazing framework
- Vercel for seamless deployment
- MongoDB for the powerful database
- All contributors and users of this project

---

**Built with ❤️ using modern web technologies**
