import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckSquare,
  LayoutDashboard,
  KanbanSquare,
  Calendar,
  ListTodo,
  Sun,
  Moon,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/kanban', label: 'Kanban', icon: KanbanSquare },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">TaskFlow</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`gap-2 ${isActive ? 'bg-secondary' : ''}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </NavLink>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.div>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hidden sm:flex">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-foreground">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="font-medium">{user?.name || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2" onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={`w-full justify-start gap-2 ${isActive ? 'bg-secondary' : ''}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </NavLink>
                );
              })}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
