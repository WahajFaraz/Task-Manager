import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  TrendingUp,
  Target,
  Award,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { stats, tasks } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || '',
  });

  useEffect(() => {
    console.log('Profile: User data updated:', user);
    setEditedUser({
      name: user?.name || user?.username || '',
      email: user?.email || '',
    });
  }, [user]);

  const handleSave = async () => {
    try {
      console.log('Profile: Updating user profile...', editedUser);
      await updateUser(editedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile: Update failed:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  console.log('Profile: Current user state:', user);
  console.log('Profile: Current stats:', stats);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const getAchievementLevel = () => {
    const completionRate = stats.completionRate;
    if (completionRate >= 90) return { level: 'Expert', color: 'bg-purple-500', icon: '🏆' };
    if (completionRate >= 75) return { level: 'Advanced', color: 'bg-blue-500', icon: '🥈' };
    if (completionRate >= 50) return { level: 'Intermediate', color: 'bg-green-500', icon: '🥉' };
    return { level: 'Beginner', color: 'bg-gray-500', icon: '⭐' };
  };

  const achievement = getAchievementLevel();

  return (
    <motion.div
      className="space-y-6 page-transition"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and view your productivity stats
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${achievement.color} text-white`}>
            {achievement.icon} {achievement.level}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {(user?.name || user?.username || 'U')?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1 p-2 rounded-md bg-muted">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{user?.name || user?.username || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1 p-2 rounded-md bg-muted">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{user?.email || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 p-2 rounded-md bg-muted">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats and Progress */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Task Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Task Statistics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {statCards.map((stat, index) => (
                <Card key={stat.title} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Productivity Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-bold text-primary">{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">Tasks Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-success">{stats.completed}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Achievement Level</span>
                  </div>
                  <p className="text-lg font-bold text-primary">{achievement.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'done' ? 'bg-success' :
                        task.status === 'in-progress' ? 'bg-info' : 'bg-muted-foreground'
                      }`} />
                      <span className="text-sm font-medium truncate">{task.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No tasks yet. Create your first task to get started!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
