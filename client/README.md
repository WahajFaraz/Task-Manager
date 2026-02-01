# Task Manager

A professional task management application built with modern web technologies.

## Features

- **Task Management**: Create, edit, delete, and organize tasks
- **Multiple Views**: Kanban board, list view, and calendar view
- **Dashboard**: Comprehensive analytics and progress tracking
- **User Authentication**: Secure login and registration system
- **Real-time Updates**: Live task status updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **Frontend**: React 18, JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd task-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── ...             # Feature-specific components
├── context/            # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # Type definitions
└── utils/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Deployment

This application can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
