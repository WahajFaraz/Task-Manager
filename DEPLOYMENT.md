# Task Manager - Vercel Deployment Guide

## 🚀 Deployment Ready Status

✅ **Client**: Ready for Vercel deployment  
✅ **Server**: Ready for Vercel deployment  
✅ **Environment**: Production configured  
✅ **CORS**: Vercel domains configured  

## 📋 Prerequisites
- MongoDB Atlas account (for cloud database)
- Vercel account
- GitHub repository

## 🖥️ Server Configuration

### Home Page Info
When deployed, the server home page (`/`) displays:
```json
{
  "message": "Task Manager API Server",
  "version": "1.0.0",
  "status": "Running",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "tasks": "/api/tasks"
  },
  "environment": "production",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### API Endpoints
- **Health Check**: `GET /api/health`
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`
- **Tasks**: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`

## 🌐 Step 1: Setup MongoDB Atlas
1. Create a free MongoDB Atlas account
2. Create a new cluster (free tier)
3. Create a database user
4. Get your connection string (replace `<password>` with your user password)
5. Whitelist your IP address (or 0.0.0.0/0 for all access)

## ⚙️ Step 2: Environment Variables Setup

### Server Environment Variables
Set these in Vercel dashboard for the server:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `NODE_ENV`: `production`
- `FRONTEND_URL`: `https://task-manager-client.vercel.app`

### Client Environment Variables
Set these in Vercel dashboard for the client:
- `VITE_API_URL`: `https://task-manager-server.vercel.app/api`

## 🚀 Step 3: Deploy to Vercel

### Deploy Server (Backend)
```bash
cd server
vercel --prod
```

### Deploy Client (Frontend)
```bash
cd client
vercel --prod
```

Or connect GitHub repository to Vercel for automatic deployment.

## 📱 Step 4: Update CORS Configuration
The server is already configured for Vercel domains:
- `https://task-manager-client.vercel.app`
- `https://task-manager.vercel.app`

## 🧪 Testing
1. Visit your deployed client app
2. Test user registration and login
3. Create, edit, and delete tasks
4. Verify all functionality works
5. Check server home page for API info

## 🔧 Troubleshooting
- Check Vercel function logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set
- Check CORS configuration if API calls fail
- Verify API URLs match deployed URLs

## 📊 Deployment URLs
- **Server**: `https://task-manager-server.vercel.app`
- **Client**: `https://task-manager-client.vercel.app`

## 🔄 CI/CD
Both applications are configured for automatic deployment when code is pushed to GitHub.
