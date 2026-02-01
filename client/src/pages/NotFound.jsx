import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              What happened?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              The page you requested could not be found. This might be because:
            </CardDescription>
            <ul className="text-left text-sm text-muted-foreground mt-4 space-y-2">
              <li>• The URL was typed incorrectly</li>
              <li>• The page was moved or deleted</li>
              <li>• You don't have permission to access this page</li>
              <li>• The link you followed is broken</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link to="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            If you think this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
