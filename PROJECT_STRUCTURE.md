# Project Structure

```
Task Manager/
├── client/                     # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # React Components
│   │   │   ├── Auth.css
│   │   │   ├── Login.js
│   │   │   ├── Navbar.css
│   │   │   ├── Navbar.js
│   │   │   ├── Register.js
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskForm.js
│   │   │   ├── TaskItem.css
│   │   │   ├── TaskItem.js
│   │   │   └── TaskList.css
│   │   │   └── TaskList.js
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.js
│   │   ├── utils/             # Utility Functions
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── server/                     # Node.js Backend
│   ├── api/
│   │   └── index.js           # Vercel serverless function
│   ├── middleware/            # Custom Middleware
│   │   └── auth.js
│   ├── models/                # Mongoose Models
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/                # Express Routes
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js               # Main server file
│   └── package.json
├── .gitignore                  # Root gitignore
├── DEPLOYMENT.md              # Deployment guide
├── package.json               # Root package.json
├── README.md                  # Project documentation
├── STARTUP.md                 # Quick start guide
├── vercel.json                # Vercel configuration
└── PROJECT_STRUCTURE.md       # This file
```

## Key Files Description

### Frontend
- **App.js**: Main React application component with routing logic
- **AuthContext.js**: React context for authentication state management
- **api.js**: Axios instance with interceptors for API calls
- **Components/**: All UI components with their respective CSS files

### Backend
- **index.js**: Main Express server file
- **api/index.js**: Vercel serverless function entry point
- **models/**: Mongoose schemas for User and Task
- **routes/**: API endpoints for authentication and tasks
- **middleware/auth.js**: JWT authentication middleware

### Configuration
- **vercel.json**: Vercel deployment configuration
- **.env files**: Environment variables (examples provided)
- **package.json**: Dependencies and scripts for both frontend and backend
