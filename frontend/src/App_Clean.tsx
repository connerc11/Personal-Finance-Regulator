import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Typography, Box, TextField, Card, CardContent, LinearProgress } from '@mui/material';

// Create a simple theme directly
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

interface SpotlightGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

function SaveSpotlightPage() {
  const [goals, setGoals] = useState<SpotlightGoal[]>(() => {
    const saved = localStorage.getItem('spotlight-goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');

  const updateGoals = (newGoals: SpotlightGoal[]) => {
    setGoals(newGoals);
    localStorage.setItem('spotlight-goals', JSON.stringify(newGoals));
  };

  const addGoal = () => {
    if (newGoalName && newGoalAmount && newGoalDate) {
      const goal: SpotlightGoal = {
        id: Date.now().toString(),
        name: newGoalName,
        targetAmount: parseFloat(newGoalAmount),
        currentAmount: 0,
        targetDate: newGoalDate
      };
      updateGoals([...goals, goal]);
      setNewGoalName('');
      setNewGoalAmount('');
      setNewGoalDate('');
    }
  };

  const addMoney = (goalId: string, amount: number) => {
    const newGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    );
    updateGoals(newGoals);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Save Spotlight</Typography>
      
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>Create New Goal</Typography>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            label="Goal Name"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            size="small"
          />
          <TextField
            label="Target Amount"
            type="number"
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(e.target.value)}
            size="small"
          />
          <TextField
            label="Target Date"
            type="date"
            value={newGoalDate}
            onChange={(e) => setNewGoalDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <Button onClick={addGoal} variant="contained">Add Goal</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <Card key={goal.id}>
              <CardContent>
                <Typography variant="h6">{goal.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${goal.currentAmount} / ${goal.targetAmount} (Target: {goal.targetDate})
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button onClick={() => addMoney(goal.id, 10)} size="small">+$10</Button>
                  <Button onClick={() => addMoney(goal.id, 25)} size="small">+$25</Button>
                  <Button onClick={() => addMoney(goal.id, 50)} size="small">+$50</Button>
                  <Button onClick={() => addMoney(goal.id, 100)} size="small">+$100</Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
        {goals.length === 0 && (
          <Typography color="text.secondary">No goals yet. Create your first savings goal!</Typography>
        )}
      </Box>
    </Box>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setCurrentPage('dashboard');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ padding: 3 }}>
        {!isLoggedIn ? (
          <Box>
            <Typography variant="h4" gutterBottom>Login</Typography>
            <Button onClick={handleLogin} variant="contained">
              Login as Demo
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <Button onClick={() => setCurrentPage('dashboard')} variant="contained">
                Dashboard
              </Button>
              <Button 
                onClick={() => setCurrentPage('save-spotlight')} 
                variant="contained" 
                sx={{ marginLeft: 1 }}
              >
                Save Spotlight
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outlined" 
                sx={{ marginLeft: 1 }}
              >
                Logout
              </Button>
            </Box>
            
            {currentPage === 'dashboard' && (
              <Box>
                <Typography variant="h4" gutterBottom>Dashboard</Typography>
                <Typography>Welcome to Personal Finance Regulator!</Typography>
              </Box>
            )}
            
            {currentPage === 'save-spotlight' && <SaveSpotlightPage />}
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
