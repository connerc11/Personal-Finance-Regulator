import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  Alert,
  CircularProgress 
} from '@mui/material';

interface SpotlightData {
  id: string;
  name: string;
  amount: number;
  targetAmount: number;
  description: string;
  createdAt: string;
}

const SaveSpotlight: React.FC = () => {
  const [spotlights, setSpotlights] = useState<SpotlightData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSpotlight, setNewSpotlight] = useState({
    name: '',
    targetAmount: '',
    description: ''
  });

  // TODO: Replace with API call to load spotlights from backend
  useEffect(() => {
    // Example: apiService.getSpotlights(user.id).then(setSpotlights)
  }, []);

  // TODO: Replace with API call to save spotlights to backend
  const saveSpotlights = async (data: SpotlightData[]) => {
    // Example: await apiService.saveSpotlights(user.id, data)
    setSpotlights(data);
  };

  const handleCreate = () => {
    if (!newSpotlight.name || !newSpotlight.targetAmount) {
      setError('Name and target amount are required');
      return;
    }

    const spotlight: SpotlightData = {
      id: Date.now().toString(),
      name: newSpotlight.name,
      amount: 0,
      targetAmount: parseFloat(newSpotlight.targetAmount),
      description: newSpotlight.description,
      createdAt: new Date().toISOString()
    };

    const updated = [...spotlights, spotlight];
    saveSpotlights(updated);
    
    setNewSpotlight({ name: '', targetAmount: '', description: '' });
    setError(null);
  };

  const handleAddAmount = (id: string, amount: number) => {
    const updated = spotlights.map(s => 
      s.id === id ? { ...s, amount: s.amount + amount } : s
    );
    saveSpotlights(updated);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Save Spotlight
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Track your savings goals and progress
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Create New Spotlight */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create New Savings Goal
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Goal Name"
              value={newSpotlight.name}
              onChange={(e) => setNewSpotlight({ ...newSpotlight, name: e.target.value })}
              sx={{ minWidth: 200 }}
            />
            <TextField
              label="Target Amount"
              type="number"
              value={newSpotlight.targetAmount}
              onChange={(e) => setNewSpotlight({ ...newSpotlight, targetAmount: e.target.value })}
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Description"
              value={newSpotlight.description}
              onChange={(e) => setNewSpotlight({ ...newSpotlight, description: e.target.value })}
              sx={{ minWidth: 200 }}
            />
            <Button variant="contained" onClick={handleCreate}>
              Create Goal
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Existing Spotlights */}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {spotlights.map((spotlight) => {
          const progress = (spotlight.amount / spotlight.targetAmount) * 100;
          
          return (
            <Card key={spotlight.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {spotlight.name}
                </Typography>
                
                {spotlight.description && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {spotlight.description}
                  </Typography>
                )}
                
                <Typography variant="h4" color="primary" gutterBottom>
                  ${spotlight.amount.toFixed(2)} / ${spotlight.targetAmount.toFixed(2)}
                </Typography>
                
                <Box sx={{ 
                  width: '100%', 
                  height: 10, 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: 5,
                  mb: 2
                }}>
                  <Box sx={{ 
                    width: `${Math.min(progress, 100)}%`, 
                    height: '100%', 
                    backgroundColor: progress >= 100 ? '#4caf50' : '#2196f3',
                    borderRadius: 5,
                    transition: 'width 0.3s ease'
                  }} />
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  {progress.toFixed(1)}% complete
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleAddAmount(spotlight.id, 10)}
                  >
                    +$10
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleAddAmount(spotlight.id, 50)}
                  >
                    +$50
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleAddAmount(spotlight.id, 100)}
                  >
                    +$100
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {spotlights.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No savings goals yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first savings goal above to get started!
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SaveSpotlight;
