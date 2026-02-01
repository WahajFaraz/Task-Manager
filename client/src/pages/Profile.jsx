import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  Zap,
  Star,
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  Edit2,
  Save,
  X,
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { getTaskStats } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const stats = getTaskStats();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await updateUser(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const getAchievementLevel = () => {
    if (stats.completionRate >= 80) return { level: 'Expert', icon: Trophy, color: 'text-purple-600', bgColor: 'bg-purple-100' };
    if (stats.completionRate >= 60) return { level: 'Advanced', icon: Star, color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (stats.completionRate >= 40) return { level: 'Intermediate', icon: Target, color: 'text-green-600', bgColor: 'bg-green-100' };
    return { level: 'Beginner', icon: Zap, color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const achievement = getAchievementLevel();
  const AchievementIcon = achievement.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and view your progress
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{user?.name || user?.username || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{user?.email || 'Not set'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{formatDate(user?.createdAt)}</span>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Task Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Task Statistics
              </CardTitle>
              <CardDescription>
                Your productivity and task completion metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{stats.completionRate}%</span>
                  </div>
                  <Progress value={stats.completionRate} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <ListTodo className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{stats.todo} To Do</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{stats.inProgress} In Progress</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{stats.completed} Done</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Level */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievement Level
              </CardTitle>
              <CardDescription>
                Your current productivity level
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${achievement.bgColor} mb-4`}>
                <AchievementIcon className={`h-10 w-10 ${achievement.color}`} />
              </div>
              <h3 className={`text-xl font-bold ${achievement.color}`}>{achievement.level}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {stats.completionRate}% completion rate
              </p>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next Level</span>
                  <span>
                    {achievement.level === 'Beginner' && '40%'}
                    {achievement.level === 'Intermediate' && '60%'}
                    {achievement.level === 'Advanced' && '80%'}
                    {achievement.level === 'Expert' && 'Max Level'}
                  </span>
                </div>
                {achievement.level !== 'Expert' && (
                  <Progress 
                    value={
                      achievement.level === 'Beginner' ? stats.completionRate - 0 :
                      achievement.level === 'Intermediate' ? stats.completionRate - 40 :
                      achievement.level === 'Advanced' ? stats.completionRate - 60 : 0
                    } 
                    className="h-2" 
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overdue Tasks</span>
                <Badge variant={stats.overdue > 0 ? 'destructive' : 'secondary'}>
                  {stats.overdue}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Productivity</span>
                <Badge variant="outline">
                  {stats.completionRate >= 80 ? 'Excellent' :
                   stats.completionRate >= 60 ? 'Good' :
                   stats.completionRate >= 40 ? 'Average' : 'Needs Improvement'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <Badge variant="default">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
