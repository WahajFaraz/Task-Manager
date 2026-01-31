# Vercel Deployment Guide

## Prerequisites
- MongoDB Atlas account (for cloud database)
- Vercel account
- GitHub repository

## Step 1: Setup MongoDB Atlas
1. Create a free MongoDB Atlas account
2. Create a new cluster (free tier)
3. Create a database user
4. Get your connection string (replace `<password>` with your user password)
5. Whitelist your IP address (or 0.0.0.0/0 for all access)

## Step 2: Update Environment Variables
In your Vercel dashboard, set the following environment variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT signing

## Step 3: Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the `vercel.json` configuration
4. Deploy!

## Step 4: Update Frontend API URL
After deployment, update the API URL in production:
1. In Vercel dashboard, set `REACT_APP_API_URL` to your deployed API URL
2. Format: `https://your-app-name.vercel.app/api`

## Testing
- Visit your deployed app
- Test user registration and login
- Create, edit, and delete tasks
- Verify all functionality works

## Troubleshooting
- Check Vercel function logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set
- Check CORS configuration if API calls fail
