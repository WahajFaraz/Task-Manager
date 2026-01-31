import React from 'react';
import { motion } from 'framer-motion';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  User,
  Award,
} from 'lucide-react';

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

const Dashboard: React.FC = () => {
  const { stats, activityData, tasks } = useTask();
  const { user } = useAuth();

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

  const statusData = [
    { name: 'Todo', value: stats.todo, color: 'hsl(var(--muted-foreground))' },
    { name: 'In Progress', value: stats.inProgress, color: 'hsl(var(--info))' },
    { name: 'Done', value: stats.completed, color: 'hsl(var(--success))' },
  ];

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: 'hsl(var(--destructive))' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: 'hsl(var(--warning))' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: 'hsl(var(--success))' },
  ];

  // Get recent activity (last 14 days for chart)
  const recentActivity = activityData.slice(-14);

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
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your productivity and manage tasks efficiently
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {stats.completionRate >= 75 && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Award className="w-3 h-3 mr-1" />
              Top Performer
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {statCards.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="hover-lift border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Completion Rate
              </CardTitle>
              <span className="text-2xl font-bold text-primary">{stats.completionRate}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={stats.completionRate} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={recentActivity}>
                    <defs>
                      <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="created"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorCreated)"
                      name="Created"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="hsl(var(--success))"
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                      name="Completed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Task Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-3">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">{item.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Priority Breakdown */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
