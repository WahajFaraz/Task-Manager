import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckSquare, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-lg mb-6">
              <CheckSquare className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">
              TaskFlow
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Organize your work, boost your productivity, and achieve your goals with our intuitive task management platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-3 gap-4 mt-12"
          >
            {['Kanban Board', 'Calendar', 'Analytics'].map((feature, i) => (
              <div key={feature} className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-lg">
                <p className="text-primary-foreground/90 text-sm font-medium">{feature}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          className="w-full max-w-md"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden flex items-center justify-center mb-8">
            <CheckSquare className="w-10 h-10 text-primary mr-3" />
            <span className="text-2xl font-bold text-foreground">TaskFlow</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to continue to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
              >
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
