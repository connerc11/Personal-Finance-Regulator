import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ScheduledPurchase } from '../types';

interface ScheduledInsightsProps {
  scheduledPurchases: ScheduledPurchase[];
  totalMonthlyAmount: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d084d0', '#8dd1e1', '#ffb347', '#87d068'];

const ScheduledInsights: React.FC<ScheduledInsightsProps> = ({ 
  scheduledPurchases, 
  totalMonthlyAmount 
}) => {
  const activePurchases = scheduledPurchases.filter(p => p.isActive);
  const inactivePurchases = scheduledPurchases.filter(p => !p.isActive);

  // Category breakdown
  const categoryData = activePurchases.reduce((acc, purchase) => {
    const existing = acc.find(item => item.category === purchase.category);
    if (existing) {
      existing.amount += purchase.frequency === 'monthly' ? purchase.amount :
                      purchase.frequency === 'yearly' ? purchase.amount / 12 :
                      purchase.frequency === 'weekly' ? purchase.amount * 4.33 :
                      purchase.amount * 30;
      existing.count += 1;
    } else {
      acc.push({
        category: purchase.category,
        amount: purchase.frequency === 'monthly' ? purchase.amount :
                purchase.frequency === 'yearly' ? purchase.amount / 12 :
                purchase.frequency === 'weekly' ? purchase.amount * 4.33 :
                purchase.amount * 30,
        count: 1,
      });
    }
    return acc;
  }, [] as Array<{ category: string; amount: number; count: number }>);

  // Frequency breakdown
  const frequencyData = activePurchases.reduce((acc, purchase) => {
    const existing = acc.find(item => item.frequency === purchase.frequency);
    if (existing) {
      existing.count += 1;
      existing.amount += purchase.amount;
    } else {
      acc.push({
        frequency: purchase.frequency,
        count: 1,
        amount: purchase.amount,
      });
    }
    return acc;
  }, [] as Array<{ frequency: string; count: number; amount: number }>);

  const largestExpense = activePurchases.reduce((max, purchase) => 
    purchase.amount > max.amount ? purchase : max, 
    activePurchases[0] || { amount: 0, name: 'None' }
  );

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const overduePurchases = activePurchases.filter(p => getDaysUntilDue(p.nextDue) < 0);
  const dueSoonPurchases = activePurchases.filter(p => {
    const days = getDaysUntilDue(p.nextDue);
    return days >= 0 && days <= 3;
  });

  return (
    <Stack spacing={3}>
      {/* Summary Statistics */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Scheduling Overview
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} divider={<Divider orientation="vertical" flexItem />}>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {activePurchases.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Schedules
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                ${totalMonthlyAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly Total
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {overduePurchases.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {dueSoonPurchases.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due Soon
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* Category Breakdown Chart */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Spending by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                  label={(entry) => `${entry.category}: $${entry.amount.toFixed(0)}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Monthly Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Frequency Distribution */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Frequency
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="frequency" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* Detailed Analytics */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Analysis
          </Typography>
          <Stack spacing={3}>
            {/* Largest Expenses */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Top Expenses by Category
              </Typography>
              <Stack spacing={2}>
                {categoryData
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((category, index) => (
                    <Box key={category.category}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          {category.category}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip 
                            label={`${category.count} items`} 
                            size="small" 
                            color="primary" 
                          />
                          <Typography variant="body1" fontWeight="bold">
                            ${category.amount.toFixed(2)}/month
                          </Typography>
                        </Stack>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(category.amount / totalMonthlyAmount) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                        color={index === 0 ? 'error' : index === 1 ? 'warning' : 'primary'}
                      />
                    </Box>
                  ))}
              </Stack>
            </Box>

            <Divider />

            {/* Payment Insights */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Payment Insights
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight="medium">
                    Largest Single Payment
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {largestExpense.name} - ${largestExpense.amount}
                  </Typography>
                </Box>
                
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight="medium">
                    Annual Commitment
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    ${(totalMonthlyAmount * 12).toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight="medium">
                    Average Payment
                  </Typography>
                  <Typography variant="h6" color="info.main">
                    ${activePurchases.length > 0 ? (totalMonthlyAmount / activePurchases.length).toFixed(2) : '0.00'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {inactivePurchases.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Paused Subscriptions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    You have {inactivePurchases.length} paused subscription(s) that could save you money.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {inactivePurchases.map((purchase) => (
                      <Chip
                        key={purchase.id}
                        label={`${purchase.name} ($${purchase.amount})`}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ScheduledInsights;
