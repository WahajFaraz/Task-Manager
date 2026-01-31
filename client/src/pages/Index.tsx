import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  ArrowRight,
  LayoutDashboard,
  KanbanSquare,
  Calendar,
  BarChart3,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: KanbanSquare,
    title: "Kanban Boards",
    description: "Visualize your workflow with drag-and-drop task management",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description: "Schedule and track tasks with an intuitive calendar interface",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Gain insights into your productivity with detailed metrics",
  },
  {
    icon: Zap,
    title: "Fast & Intuitive",
    description: "Built for speed with a clean, modern interface",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="gradient-primary">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Boost your productivity
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
              Manage tasks with{" "}
              <span className="text-gradient">clarity and speed</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              TaskFlow helps you organize your work, track progress, and achieve your goals
              with an intuitive, beautiful interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary text-lg px-8">
                <Link to="/register">
                  Start for free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/login">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  View demo
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl gradient-hero p-12 md:p-20 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-lg mb-6">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
              Join thousands of users who are already boosting their productivity with TaskFlow.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/register">
                Create free account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
