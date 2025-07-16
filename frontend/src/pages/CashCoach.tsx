import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  Stack,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Psychology as AiIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Savings as SavingsIcon,
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  MonetizationOn as MoneyIcon,
  ShoppingCart as ShoppingIcon,
  Restaurant as FoodIcon,
  DirectionsCar as TransportIcon,
  Home as HousingIcon,
  LocalHospital as HealthIcon,
  School as EducationIcon,
  Movie as EntertainmentIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  AutoAwesome as MagicIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

import { transactionAPI, budgetAPI, scheduledPurchaseAPI, goalsAPI } from '../services/apiService';
import { ScheduledPurchase, FinancialGoal } from '../types';

// Constants for localStorage keys
const TRANSACTIONS_KEY = 'personal_finance_transactions';
const BUDGETS_KEY = 'personal_finance_budgets';
const SCHEDULED_PURCHASES_KEY = 'personal_finance_scheduled_purchases';
const PAST_PURCHASES_KEY = 'personal_finance_past_purchases';

interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  lastMonth: number;
  icon: React.ReactElement;
  color: string;
}

interface AIRecommendation {
  id: string;
  type: 'save' | 'invest' | 'optimize' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  potentialSavings: number;
  category: string;
  action: string;
  confidence: number;
  priority: number;
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'opportunity' | 'warning' | 'achievement';
  title: string;
  description: string;
  data: any;
  confidence: number;
}

interface CoachingGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  status: 'on-track' | 'behind' | 'ahead' | 'completed';
  suggestions: string[];
}

interface CashCoachSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'budgeting' | 'saving' | 'investing' | 'debt' | 'spending';
  difficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: string;
  potentialBenefit: string;
  icon: React.ReactElement;
  tips: string[];
}

interface PastPurchase {
  id: number;
  originalScheduleId: number;
  name: string;
  amount: number;
  category: string;
  executedDate: string;
  scheduledDate: string;
  userId: number;
}

const CashCoach: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);

  // User-specific data from backend
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPattern[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [coachingGoals, setCoachingGoals] = useState<CoachingGoal[]>([]);
  const [scheduledPurchases, setScheduledPurchases] = useState<ScheduledPurchase[]>([]);
  const [pastPurchases, setPastPurchases] = useState<PastPurchase[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [userGoals, setUserGoals] = useState<FinancialGoal[]>([]);

  // General financial suggestions (not user-specific)
  const generalSuggestions: CashCoachSuggestion[] = [
    {
      id: '1',
      title: 'Automate Your Savings',
      description: 'Set up automatic transfers to your savings account to build wealth consistently without thinking about it.',
      category: 'saving',
      difficulty: 'easy',
      timeToImplement: '15 minutes',
      potentialBenefit: 'Save $2,000+ annually',
      icon: <SavingsIcon />,
      tips: [
        'Start with just $25-50 per paycheck',
        'Use a separate high-yield savings account',
        'Increase the amount by 1% every few months',
        'Set up the transfer right after payday'
      ]
    },
    {
      id: '2',
      title: 'Track Every Dollar',
      description: 'Use the app to monitor all expenses and identify spending patterns that might surprise you.',
      category: 'budgeting',
      difficulty: 'easy',
      timeToImplement: '30 minutes setup',
      potentialBenefit: 'Reduce spending by 10-15%',
      icon: <AnalyticsIcon />,
      tips: [
        'Categorize every transaction',
        'Review weekly spending patterns',
        'Set alerts for budget overruns',
        'Take photos of receipts immediately'
      ]
    },
    {
      id: '3',
      title: 'Emergency Fund Priority',
      description: 'Build an emergency fund covering 3-6 months of expenses before focusing on other financial goals.',
      category: 'saving',
      difficulty: 'medium',
      timeToImplement: '6-12 months',
      potentialBenefit: 'Financial security & peace of mind',
      icon: <WarningIcon />,
      tips: [
        'Start with $1,000 as your first milestone',
        'Keep emergency funds in a separate account',
        'Only use for true emergencies',
        'Replenish immediately after use'
      ]
    },
    {
      id: '4',
      title: 'Debt Avalanche Method',
      description: 'Pay minimum on all debts, then put extra money toward the highest interest rate debt first.',
      category: 'debt',
      difficulty: 'medium',
      timeToImplement: 'Ongoing strategy',
      potentialBenefit: 'Save thousands in interest',
      icon: <TrendingDownIcon />,
      tips: [
        'List all debts with interest rates',
        'Always pay minimums first',
        'Attack highest rate debt aggressively',
        'Consider balance transfers for high-rate cards'
      ]
    },
    {
      id: '5',
      title: 'Meal Planning & Prep',
      description: 'Plan meals weekly and prep ingredients to reduce food waste and dining out expenses.',
      category: 'spending',
      difficulty: 'medium',
      timeToImplement: '2 hours weekly',
      potentialBenefit: 'Save $200-400 monthly',
      icon: <FoodIcon />,
      tips: [
        'Plan meals around sales and seasonal produce',
        'Prep ingredients on weekends',
        'Cook larger portions for leftovers',
        'Keep healthy snacks prepared'
      ]
    },
    {
      id: '6',
      title: 'Start Investing Early',
      description: 'Even small amounts invested regularly can grow significantly over time due to compound interest.',
      category: 'investing',
      difficulty: 'hard',
      timeToImplement: '1-2 hours research',
      potentialBenefit: 'Build long-term wealth',
      icon: <TrendingUpIcon />,
      tips: [
        'Start with low-cost index funds',
        'Contribute to employer 401(k) match first',
        'Consider automated investing apps',
        'Don\'t try to time the market'
      ]
    }
  ];

  // Load and analyze user data

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setScheduledPurchases([]);
      setPastPurchases([]);
      setSpendingPatterns([]);
      setAiRecommendations([]);
      setAiInsights([]);
      setCoachingGoals([]);
      setLoading(false);
      setAnalysisComplete(false);
      return;
    }
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch transactions and budgets from backend

      const [transactionsRes, budgetsRes, scheduledRes, goalsRes] = await Promise.all([
        transactionAPI.getAll(user.id),
        budgetAPI.getAll(user.id),
        scheduledPurchaseAPI.getAll(),
        goalsAPI.getAll(user.id)
      ]);

      const transactions = transactionsRes.success ? transactionsRes.data : [];
      const budgets = budgetsRes.success ? budgetsRes.data : [];
      const scheduled = scheduledRes && scheduledRes.success ? scheduledRes.data : [];
      const goals = goalsRes && goalsRes.success ? goalsRes.data : [];

      setTransactions(transactions);
      setBudgets(budgets);
      setScheduledPurchases(scheduled);
      setUserGoals(goals);

      // If there is a backend API for past purchases, fetch here. Otherwise, leave as empty array.
      setPastPurchases([]);

      // Analyze spending patterns
      const patterns = analyzeSpendingPatterns(transactions);
      setSpendingPatterns(patterns);

      // Generate AI recommendations (now including scheduled purchases)
      const recommendations = generateRecommendations(transactions, budgets, patterns, scheduled);
      setAiRecommendations(recommendations);

      // Generate insights (now including scheduled purchases)
      const insights = generateInsights(transactions, budgets, scheduled);
      setAiInsights(insights);

      // Generate goals based on user data and real user goals
      const coaching = generateGoals(transactions, budgets, scheduled, goals);
      setCoachingGoals(coaching);

      // Simulate AI processing time (skip in test environment)
      const delay = process.env.NODE_ENV === 'test' ? 0 : 1500;
      setTimeout(() => {
        setLoading(false);
        setAnalysisComplete(true);
      }, delay);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setLoading(false);
    }
  };

  const analyzeSpendingPatterns = (transactions: any[]): SpendingPattern[] => {
    if (transactions.length === 0) return [];

    const categoryTotals: Record<string, { current: number; previous: number }> = {};
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate current and previous month totals
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const transactionDate = new Date(transaction.date);
        const category = transaction.category || 'Other';
        
        if (!categoryTotals[category]) {
          categoryTotals[category] = { current: 0, previous: 0 };
        }

        if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
          categoryTotals[category].current += Math.abs(transaction.amount);
        } else if (transactionDate.getMonth() === previousMonth && transactionDate.getFullYear() === previousYear) {
          categoryTotals[category].previous += Math.abs(transaction.amount);
        }
      }
    });

    const totalCurrentSpending = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.current, 0);
    
    const getCategoryIcon = (category: string) => {
      switch (category.toLowerCase()) {
        case 'food': case 'food & dining': case 'groceries': case 'restaurants': return <FoodIcon />;
        case 'transportation': case 'gas': case 'car': return <TransportIcon />;
        case 'housing': case 'rent': case 'utilities': return <HousingIcon />;
        case 'entertainment': case 'movies': case 'games': return <EntertainmentIcon />;
        case 'healthcare': case 'medical': case 'health': return <HealthIcon />;
        case 'education': case 'learning': return <EducationIcon />;
        case 'shopping': case 'retail': return <ShoppingIcon />;
        default: return <MoneyIcon />;
      }
    };

    const getCategoryColor = (index: number) => {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
      return colors[index % colors.length];
    };

    return Object.entries(categoryTotals)
      .filter(([_, amounts]) => amounts.current > 0)
      .map(([category, amounts], index) => {
        const percentage = totalCurrentSpending > 0 ? (amounts.current / totalCurrentSpending) * 100 : 0;
        let trend: 'up' | 'down' | 'stable' = 'stable';
        
        if (amounts.previous > 0) {
          const change = ((amounts.current - amounts.previous) / amounts.previous) * 100;
          if (change > 5) trend = 'up';
          else if (change < -5) trend = 'down';
        }

        return {
          category,
          amount: amounts.current,
          percentage: Math.round(percentage),
          trend,
          lastMonth: amounts.previous,
          icon: getCategoryIcon(category),
          color: getCategoryColor(index),
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  const generateRecommendations = (transactions: any[], budgets: any[], patterns: SpendingPattern[], scheduledPurchases: ScheduledPurchase[] = []): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    let idCounter = 1;

    // If no data, return empty array
    if (transactions.length === 0) return recommendations;

    // Upcoming scheduled purchases recommendations
    if (scheduledPurchases.length > 0) {
      const upcomingPurchases = scheduledPurchases.filter(p => {
        const dueDate = new Date(p.nextDue);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0 && p.isActive;
      });

      if (upcomingPurchases.length > 0) {
        const totalUpcoming = upcomingPurchases.reduce((sum, p) => sum + p.amount, 0);
        recommendations.push({
          id: (idCounter++).toString(),
          type: 'alert',
          title: 'Upcoming Scheduled Purchases',
          description: `You have ${upcomingPurchases.length} scheduled purchases totaling $${totalUpcoming.toFixed(2)} in the next 30 days. Consider adjusting your budget accordingly.`,
          impact: totalUpcoming > 1000 ? 'high' : totalUpcoming > 500 ? 'medium' : 'low',
          potentialSavings: 0,
          category: 'planning',
          action: 'Review and adjust monthly budget to accommodate upcoming purchases',
          confidence: 95,
          priority: totalUpcoming > 1000 ? 1 : 2
        });
      }

      // Large scheduled purchase savings recommendation
      const largePurchases = scheduledPurchases.filter(p => p.amount > 1000 && p.isActive);
      if (largePurchases.length > 0) {
        const nextLarge = largePurchases.sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())[0];
        const daysUntil = Math.ceil((new Date(nextLarge.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const savingsNeeded = Math.ceil(nextLarge.amount / Math.max(daysUntil / 30, 1));
        
        recommendations.push({
          id: (idCounter++).toString(),
          type: 'save',
          title: 'Prepare for Large Purchase',
          description: `You have "${nextLarge.name}" scheduled for $${nextLarge.amount.toFixed(2)}. Start saving $${savingsNeeded} per month to be ready.`,
          impact: 'high',
          potentialSavings: nextLarge.amount,
          category: 'saving',
          action: `Set up automatic transfer of $${savingsNeeded} monthly to a dedicated savings account`,
          confidence: 90,
          priority: 1
        });
      }
    }

    // High spending category recommendation
    if (patterns.length > 0) {
      const highestCategory = patterns[0];
      if (highestCategory.amount > 500) {
        recommendations.push({
          id: (idCounter++).toString(),
          type: 'optimize',
          title: `Optimize ${highestCategory.category} Spending`,
          description: `You've spent $${highestCategory.amount.toFixed(0)} on ${highestCategory.category.toLowerCase()} this month. Consider ways to reduce this expense category.`,
          impact: 'high',
          potentialSavings: Math.round(highestCategory.amount * 0.2),
          category: highestCategory.category,
          action: `Review and reduce ${highestCategory.category.toLowerCase()} expenses`,
          confidence: 85,
          priority: 1,
        });
      }
    }

    // Trending up category alert
    const trendingUpCategories = patterns.filter(p => p.trend === 'up' && p.lastMonth > 0);
    if (trendingUpCategories.length > 0) {
      const category = trendingUpCategories[0];
      const increase = ((category.amount - category.lastMonth) / category.lastMonth) * 100;
      recommendations.push({
        id: (idCounter++).toString(),
        type: 'alert',
        title: `${category.category} Spending Increased`,
        description: `Your ${category.category.toLowerCase()} spending increased by ${increase.toFixed(0)}% from last month. Monitor this category closely.`,
        impact: 'medium',
        potentialSavings: Math.round((category.amount - category.lastMonth) * 0.5),
        category: category.category,
        action: `Monitor and reduce ${category.category.toLowerCase()} spending`,
        confidence: 78,
        priority: 2,
      });
    }

    // Budget variance recommendations
    budgets.forEach(budget => {
      if (budget.spent > budget.amount * 0.9) {
        recommendations.push({
          id: (idCounter++).toString(),
          type: 'alert',
          title: `${budget.category} Budget Almost Exceeded`,
          description: `You've used ${((budget.spent / budget.amount) * 100).toFixed(0)}% of your ${budget.category} budget. Consider reducing spending in this category.`,
          impact: budget.spent > budget.amount ? 'high' : 'medium',
          potentialSavings: Math.round(budget.spent - budget.amount),
          category: budget.category,
          action: `Reduce ${budget.category.toLowerCase()} spending`,
          confidence: 92,
          priority: budget.spent > budget.amount ? 1 : 2,
        });
      }
    });

    // Emergency fund recommendation if total income is known
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (totalIncome > 0) {
      recommendations.push({
        id: (idCounter++).toString(),
        type: 'save',
        title: 'Build Emergency Fund',
        description: 'Start building an emergency fund that covers 3-6 months of expenses for financial security.',
        impact: 'high',
        potentialSavings: 0,
        category: 'Savings',
        action: 'Set up automatic savings transfer',
        confidence: 95,
        priority: 3,
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  };

  const generateInsights = (transactions: any[], budgets: any[], scheduledPurchases: ScheduledPurchase[] = []): AIInsight[] => {
    const insights: AIInsight[] = [];
    let idCounter = 1;

    if (transactions.length === 0) return insights;

    // Scheduled purchases insights
    if (scheduledPurchases.length > 0) {
      const activePurchases = scheduledPurchases.filter(p => p.isActive);
      const monthlyScheduledTotal = activePurchases.reduce((sum, p) => {
        switch (p.frequency) {
          case 'daily': return sum + (p.amount * 30);
          case 'weekly': return sum + (p.amount * 4.33);
          case 'monthly': return sum + p.amount;
          case 'yearly': return sum + (p.amount / 12);
          default: return sum;
        }
      }, 0);

      if (monthlyScheduledTotal > 0) {
        insights.push({
          id: (idCounter++).toString(),
          type: 'pattern',
          title: 'Scheduled Purchase Impact',
          description: `Your scheduled purchases add $${monthlyScheduledTotal.toFixed(2)} to your monthly expenses. Consider this when setting budgets.`,
          data: { monthlyAmount: monthlyScheduledTotal, count: activePurchases.length },
          confidence: 90
        });
      }

      // Check for potentially redundant scheduled purchases
      const categories = activePurchases.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const duplicateCategories = Object.entries(categories).filter(([_, count]) => count > 2);
      if (duplicateCategories.length > 0) {
        insights.push({
          id: (idCounter++).toString(),
          type: 'opportunity',
          title: 'Multiple Scheduled Purchases in Same Category',
          description: `You have multiple scheduled purchases in ${duplicateCategories.map(([cat]) => cat).join(', ')}. Consider consolidating to reduce complexity.`,
          data: { duplicateCategories },
          confidence: 75
        });
      }
    }

    // Spending pattern insight
    const weekendSpending = transactions
      .filter(t => t.type === 'expense' && [0, 6].includes(new Date(t.date).getDay()))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const weekdaySpending = transactions
      .filter(t => t.type === 'expense' && ![0, 6].includes(new Date(t.date).getDay()))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (weekendSpending > 0 && weekdaySpending > 0) {
      const weekendRatio = weekendSpending / (weekendSpending + weekdaySpending);
      if (weekendRatio > 0.35) {
        insights.push({
          id: (idCounter++).toString(),
          type: 'pattern',
          title: 'Weekend Spending Pattern',
          description: `You spend ${(weekendRatio * 100).toFixed(0)}% of your money on weekends. Consider budgeting specifically for weekend activities.`,
          data: { weekendSpending, weekdaySpending },
          confidence: 87,
        });
      }
    }

    // Budget performance insight
    const budgetsOnTrack = budgets.filter(b => b.spent <= b.amount * 0.8).length;
    if (budgets.length > 0) {
      const successRate = (budgetsOnTrack / budgets.length) * 100;
      if (successRate >= 70) {
        insights.push({
          id: (idCounter++).toString(),
          type: 'achievement',
          title: 'Budget Discipline Success',
          description: `Great job! You're staying within budget on ${successRate.toFixed(0)}% of your categories. Keep up the excellent work!`,
          data: { successRate, totalBudgets: budgets.length },
          confidence: 100,
        });
      }
    }

    // Income vs expenses insight
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (totalIncome > totalExpenses && totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
      insights.push({
        id: (idCounter++).toString(),
        type: 'achievement',
        title: 'Positive Cash Flow',
        description: `Excellent! You're saving ${savingsRate.toFixed(0)}% of your income. You're on track for financial success.`,
        data: { savingsRate, surplus: totalIncome - totalExpenses },
        confidence: 100,
      });
    }

    return insights;
  };

  // Now includes userGoals from backend
  const generateGoals = (transactions: any[], budgets: any[], scheduledPurchases: ScheduledPurchase[] = [], userGoals: FinancialGoal[] = []): CoachingGoal[] => {
    const goals: CoachingGoal[] = [];

    // Add user goals from backend
    if (userGoals && userGoals.length > 0) {
      userGoals.forEach(goal => {
        goals.push({
          id: `usergoal_${goal.id}`,
          title: goal.title,
          target: goal.targetAmount,
          current: goal.currentAmount,
          deadline: goal.targetDate,
          status: goal.isCompleted ? 'completed' : 'on-track',
          suggestions: [goal.description]
        });
      });
    }

    // Goals based on scheduled purchases
    if (scheduledPurchases.length > 0) {
      const largePurchases = scheduledPurchases
        .filter(p => p.amount > 500 && p.isActive)
        .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime());

      largePurchases.slice(0, 3).forEach((purchase, index) => {
        const daysUntil = Math.ceil((new Date(purchase.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const monthsUntil = Math.max(daysUntil / 30, 1);
        const monthlySavings = purchase.amount / monthsUntil;
        
        goals.push({
          id: `scheduled_${purchase.id}`,
          title: `Save for ${purchase.name}`,
          target: purchase.amount,
          current: 0, // This could be enhanced to track actual savings progress
          deadline: purchase.nextDue,
          status: daysUntil < 30 ? 'behind' : daysUntil < 60 ? 'on-track' : 'ahead',
          suggestions: [
            `Save $${monthlySavings.toFixed(2)} per month`,
            `Set up automatic transfer to dedicated savings account`,
            `Consider reducing discretionary spending in other categories`,
            `Look for additional income opportunities if needed`
          ]
        });
      });

      // Overall scheduled purchases management goal
      if (scheduledPurchases.length > 5) {
        goals.push({
          id: 'manage_scheduled',
          title: 'Optimize Scheduled Purchases',
          target: scheduledPurchases.length,
          current: scheduledPurchases.filter(p => p.isActive).length,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'on-track',
          suggestions: [
            'Review all scheduled purchases monthly',
            'Cancel or postpone non-essential items',
            'Consolidate similar purchases',
            'Adjust frequencies to match your cash flow'
          ]
        });
      }
    }

    if (transactions.length === 0) return goals;

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Emergency fund goal
    const emergencyTarget = totalExpenses * 3; // 3 months of expenses
    goals.push({
      id: '1',
      title: 'Emergency Fund',
      target: emergencyTarget,
      current: 0, // User would need to input their current savings
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      status: 'behind',
      suggestions: [
        'Save 10% of income automatically',
        'Reduce dining out by 25%',
        'Set up a separate high-yield savings account',
      ],
    });

    // Find highest spending category for reduction goal
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = t.category || 'Other';
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(t.amount);
      });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const [topCategory, amount] = sortedCategories[0];
      const reductionTarget = amount * 0.8; // Reduce by 20%
      
      goals.push({
        id: '2',
        title: `Reduce ${topCategory} Spending`,
        target: reductionTarget,
        current: amount,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 months from now
        status: amount > reductionTarget ? 'behind' : 'on-track',
        suggestions: [
          `Set a monthly budget for ${topCategory.toLowerCase()}`,
          'Track all expenses in this category',
          'Look for cheaper alternatives',
          'Review and cancel unnecessary subscriptions',
        ],
      });
    }

    return goals;
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'save': return <SavingsIcon />;
      case 'invest': return <TrendingUpIcon />;
      case 'optimize': return <LightbulbIcon />;
      case 'alert': return <WarningIcon />;
      default: return <AiIcon />;
    }
  };

  const getRecommendationColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'success';
      case 'ahead': return 'info';
      case 'behind': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getSuggestionIcon = (category: string) => {
    switch (category) {
      case 'saving': return <SavingsIcon />;
      case 'budgeting': return <AnalyticsIcon />;
      case 'investing': return <TrendingUpIcon />;
      case 'debt': return <TrendingDownIcon />;
      case 'spending': return <MoneyIcon />;
      default: return <LightbulbIcon />;
    }
  };

  const getSuggestionColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const handleRecommendationFeedback = (recommendation: AIRecommendation, helpful: boolean) => {
    // In real app, send feedback to improve AI recommendations
    console.log(`Feedback for ${recommendation.id}: ${helpful ? 'Helpful' : 'Not helpful'}`);
    alert(`Thank you for your feedback! This helps improve our AI recommendations.`);
  };

  const refreshAnalysis = () => {
    if (user) {
      loadUserData();
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <AiIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              Cash Coach AI
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Analyzing your financial patterns...
            </Typography>
          </Box>
        </Box>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AiIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">AI Analysis in Progress</Typography>
            </Box>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Our AI is analyzing your spending patterns, identifying savings opportunities, and preparing personalized recommendations...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
            <AiIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Cash Coach AI
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Your personal AI financial advisor
            </Typography>
          </Box>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Tooltip title="Refresh Analysis">
            <IconButton onClick={refreshAnalysis} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Chip
            icon={<CheckCircleIcon />}
            label="Analysis Complete"
            color="success"
            variant="outlined"
          />
        </Stack>
      </Box>

      {/* Success Alert */}
      {analysisComplete && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            AI Analysis Complete!
          </Typography>
          <Typography variant="body2">
            I've analyzed your spending patterns and found {aiRecommendations.length} opportunities to optimize your finances.
            Potential savings: <strong>${aiRecommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0)}/year</strong>
          </Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<LightbulbIcon />} label="AI Recommendations" />
          <Tab icon={<AnalyticsIcon />} label="Spending Analysis" />
          <Tab icon={<AssessmentIcon />} label="Financial Goals" />
          <Tab icon={<TimelineIcon />} label="AI Insights" />
          <Tab icon={<ShoppingIcon />} label="Scheduled Purchases" />
          <Tab icon={<MagicIcon />} label="Cash Coach Tips" />
        </Tabs>
      </Card>

      {/* AI Recommendations Tab */}
      {currentTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Personalized Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Based on your spending patterns, here are AI-powered suggestions to optimize your finances:
          </Typography>

          {aiRecommendations.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <AiIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No AI Recommendations Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start by adding some transactions and budgets so our AI can analyze your spending patterns and provide personalized recommendations.
                </Typography>
                <Button variant="outlined" onClick={refreshAnalysis} startIcon={<RefreshIcon />}>
                  Analyze My Data
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={3}>
              {aiRecommendations
                .sort((a, b) => a.priority - b.priority)
                .map((recommendation) => (
                <Card key={recommendation.id} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ bgcolor: `${getRecommendationColor(recommendation.impact)}.main` }}>
                        {getRecommendationIcon(recommendation.type)}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6">
                            {recommendation.title}
                          </Typography>
                          <Chip
                            label={`${recommendation.impact} impact`}
                            color={getRecommendationColor(recommendation.impact) as any}
                            size="small"
                          />
                          <Chip
                            label={`${recommendation.confidence}% confidence`}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {recommendation.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Potential Annual Savings
                            </Typography>
                            <Typography variant="h6" color="success.main">
                              ${recommendation.potentialSavings}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Category
                            </Typography>
                            <Typography variant="body2">
                              {recommendation.category}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Recommended Action
                            </Typography>
                            <Typography variant="body2">
                              {recommendation.action}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                          >
                            Accept Recommendation
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleRecommendationFeedback(recommendation, true)}
                            startIcon={<ThumbUpIcon />}
                          >
                            Helpful
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleRecommendationFeedback(recommendation, false)}
                            startIcon={<ThumbDownIcon />}
                          >
                            Not Helpful
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Spending Analysis Tab */}
      {currentTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            AI Spending Pattern Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            AI-powered breakdown of your spending patterns with trend analysis:
          </Typography>

          {spendingPatterns.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Spending Data to Analyze
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add some expense transactions to see your spending patterns and trends analyzed by our AI.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              {spendingPatterns.map((pattern) => (
              <Card key={pattern.category}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: pattern.color }}>
                        {pattern.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {pattern.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pattern.percentage}% of total spending
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h5" fontWeight="bold">
                        ${pattern.amount}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {pattern.trend === 'up' ? (
                          <TrendingUpIcon color="error" fontSize="small" />
                        ) : pattern.trend === 'down' ? (
                          <TrendingDownIcon color="success" fontSize="small" />
                        ) : (
                          <Box sx={{ width: 16, height: 16, bgcolor: 'grey.400', borderRadius: '50%' }} />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          vs last month: ${pattern.lastMonth}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={pattern.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: pattern.color,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            ))}
            </Box>
          )}
        </Box>
      )}

      {/* Financial Goals Tab */}
      {currentTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            AI-Tracked Financial Goals
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your progress on financial goals with AI-powered suggestions:
          </Typography>

          {coachingGoals.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Financial Goals Set
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI will help you set and track financial goals based on your spending patterns and income.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={3}>
              {coachingGoals.map((goal) => (
              <Card key={goal.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {goal.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Target: ${goal.target} by {new Date(goal.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={goal.status.replace('-', ' ')}
                      color={getGoalStatusColor(goal.status) as any}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Progress: ${goal.current} / ${goal.target}
                      </Typography>
                      <Typography variant="body2">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(goal.current / goal.target) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      AI Suggestions:
                    </Typography>
                    <List dense>
                      {goal.suggestions.map((suggestion, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <LightbulbIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={suggestion}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            ))}
            </Stack>
          )}
        </Box>
      )}

      {/* AI Insights Tab */}
      {currentTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            AI Financial Insights
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Advanced insights discovered by analyzing your financial behavior:
          </Typography>

          {aiInsights.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <TimelineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Insights Available Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI needs more transaction data to generate meaningful financial insights.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={3}>
              {aiInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{
                        bgcolor: insight.type === 'achievement' ? 'success.main' :
                                 insight.type === 'warning' ? 'warning.main' :
                                 insight.type === 'opportunity' ? 'info.main' : 'primary.main'
                      }}>
                        {insight.type === 'achievement' ? <CheckCircleIcon /> :
                         insight.type === 'warning' ? <WarningIcon /> :
                         insight.type === 'opportunity' ? <LightbulbIcon /> : <TimelineIcon />}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6">
                            {insight.title}
                          </Typography>
                          <Chip
                            label={`${insight.confidence}% confidence`}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          {insight.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Scheduled Purchases Tab */}
      {currentTab === 4 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Scheduled Purchases Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Analysis of your planned purchases and their impact on your financial goals:
          </Typography>

          {scheduledPurchases.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <ShoppingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Scheduled Purchases Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add scheduled purchases to get AI insights about your planned expenses.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={3}>
              {/* Summary Card */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Scheduled Purchases Summary
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mt: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main">
                        {scheduledPurchases.filter(p => p.isActive).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Purchases
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        ${scheduledPurchases
                          .filter(p => p.isActive)
                          .reduce((sum, p) => {
                            switch (p.frequency) {
                              case 'daily': return sum + (p.amount * 30);
                              case 'weekly': return sum + (p.amount * 4.33);
                              case 'monthly': return sum + p.amount;
                              case 'yearly': return sum + (p.amount / 12);
                              default: return sum;
                            }
                          }, 0)
                          .toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Impact
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {pastPurchases.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Executed Purchases
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Upcoming Purchases */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Purchases (Next 30 Days)
                  </Typography>
                  {(() => {
                    const upcomingPurchases = scheduledPurchases.filter(p => {
                      const dueDate = new Date(p.nextDue);
                      const today = new Date();
                      const diffTime = dueDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 30 && diffDays >= 0 && p.isActive;
                    });

                    return upcomingPurchases.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No purchases scheduled for the next 30 days.
                      </Typography>
                    ) : (
                      <Stack spacing={2}>
                        {upcomingPurchases.map((purchase) => {
                          const daysUntil = Math.ceil((new Date(purchase.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <Box key={purchase.id} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1
                            }}>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {purchase.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {purchase.category} • Due in {daysUntil} days
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" color="primary.main">
                                  ${purchase.amount.toFixed(2)}
                                </Typography>
                                <Chip 
                                  label={purchase.frequency} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          );
                        })}
                      </Stack>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Past Purchases Insights */}
              {pastPurchases.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Executed Purchases
                    </Typography>
                    <Stack spacing={1}>
                      {pastPurchases.slice(-5).reverse().map((purchase) => (
                        <Box key={purchase.id} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          py: 1
                        }}>
                          <Box>
                            <Typography variant="body1">
                              {purchase.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {purchase.category} • Executed on {new Date(purchase.executedDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="bold">
                            ${purchase.amount.toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}
        </Box>
      )}

      {/* Cash Coach Tips Tab */}
      {currentTab === 5 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Cash Coach Financial Tips
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            General financial wisdom and strategies to improve your money management:
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
            {generalSuggestions.map((suggestion) => (
              <Card key={suggestion.id} sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${getSuggestionColor(suggestion.difficulty)}.main` }}>
                      {getSuggestionIcon(suggestion.category)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">
                          {suggestion.title}
                        </Typography>
                        <Chip
                          label={suggestion.difficulty}
                          color={getSuggestionColor(suggestion.difficulty) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {suggestion.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Time to Implement
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {suggestion.timeToImplement}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Potential Benefit
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {suggestion.potentialBenefit}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Implementation Tips:
                  </Typography>
                  <List dense>
                    {suggestion.tips.map((tip, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <StarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={tip}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Provide Feedback</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Help us improve our AI recommendations by providing feedback:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Tell us what you think about this recommendation..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setFeedbackDialog(false)}>
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CashCoach;
