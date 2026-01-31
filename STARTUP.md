# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Installation Steps

### 1. Clone and Install Dependencies
```bash
git clone <your-repository-url>
cd "Task Manager"
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Setup Environment Variables
Create a `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 5. Start MongoDB
If using local MongoDB:
```bash
mongod
```

### 6. Run the Application

#### Option A: Run both frontend and backend together
```bash
cd ..
npm install concurrently
npm run dev
```

#### Option B: Run separately
Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

## Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features to Test
1. User registration
2. User login
3. Create tasks
4. Edit tasks
5. Mark tasks as complete
6. Delete tasks
7. Set task priorities
8. Add due dates

## Next Steps
After testing locally, follow the DEPLOYMENT.md guide to deploy to Vercel.
