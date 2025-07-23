import React, { useState } from 'react';
// @ts-ignore
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Avatar,
  Container,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  AccountBalance as BankIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!formData.identifier || !formData.password) {
      setError('Please enter username or email and password');
      setLoading(false);
      return;
    }

    try {
      await login(formData.identifier, formData.password);
      // Redirect to intended page or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      setError('Wrong username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would integrate with OAuth providers
    setError(`${provider} login will be implemented in the full version`);
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@personalfinance.com',
      password: 'demo123',
      rememberMe: false,
    });
    
    try {
      setLoading(true);
      await login('demo@personalfinance.com', 'demo123');
      // Redirect to intended page or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      }}>
        <Card sx={{ 
          width: '100%', 
          maxWidth: 480,
          backgroundColor: '#1a1a1a',
          border: '2px solid #00ff88',
          borderRadius: 3,
          boxShadow: `
            0 0 20px rgba(0, 255, 136, 0.3),
            0 0 40px rgba(0, 255, 136, 0.2),
            0 0 60px rgba(0, 255, 136, 0.1)
          `,
          '&:hover': {
            boxShadow: `
              0 0 30px rgba(0, 255, 136, 0.4),
              0 0 50px rgba(0, 255, 136, 0.3),
              0 0 70px rgba(0, 255, 136, 0.2)
            `,
          },
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ 
                bgcolor: '#00ff88', 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
                border: '2px solid #00ff88',
              }}>
                <BankIcon sx={{ fontSize: 32, color: '#000' }} />
              </Avatar>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#fff' }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: '#00ff88' }}>
                Sign in to your Personal Finance account
              </Typography>
            </Box>

            {/* Demo Login Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleDemoLogin}
              disabled={loading}
              sx={{ 
                mb: 3, 
                py: 1.5,
                borderColor: '#00ff88',
                color: '#00ff88',
                backgroundColor: 'transparent',
                '&:hover': {
                  borderColor: '#00ff88',
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
                },
                '&:disabled': {
                  borderColor: '#666',
                  color: '#666',
                },
              }}
            >
              Try Demo Account
            </Button>

            <Divider sx={{ mb: 3, borderColor: '#333' }}>
              <Typography variant="body2" sx={{ color: '#888' }}>
                or sign in with email
              </Typography>
            </Divider>

            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  color: '#ff6b6b',
                  '& .MuiAlert-icon': {
                    color: '#ff6b6b',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username or Email"
                type="text"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#00ff88' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& fieldset': {
                      borderColor: '#555',
                    },
                    '&:hover fieldset': {
                      borderColor: '#00ff88',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00ff88',
                      boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#888',
                    '&.Mui-focused': {
                      color: '#00ff88',
                    },
                  },
                }}
                autoComplete="username"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#00ff88' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#00ff88' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& fieldset': {
                      borderColor: '#555',
                    },
                    '&:hover fieldset': {
                      borderColor: '#00ff88',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00ff88',
                      boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#888',
                    '&.Mui-focused': {
                      color: '#00ff88',
                    },
                  },
                }}
                autoComplete="current-password"
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      disabled={loading}
                      sx={{
                        color: '#555',
                        '&.Mui-checked': {
                          color: '#00ff88',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        },
                      }}
                    />
                  }
                  label={<Typography sx={{ color: '#ccc' }}>Remember me</Typography>}
                />
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    color: '#00ff88',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      textShadow: '0 0 5px rgba(0, 255, 136, 0.5)',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  py: 1.5, 
                  mb: 3,
                  position: 'relative',
                  backgroundColor: '#00ff88',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#00cc6a',
                    boxShadow: '0 0 25px rgba(0, 255, 136, 0.5)',
                  },
                  '&:disabled': {
                    backgroundColor: '#555',
                    color: '#888',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: '#000' }} />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            {/* Social Login */}
            <Divider sx={{ mb: 3, borderColor: '#333' }}>
              <Typography variant="body2" sx={{ color: '#888' }}>
                or continue with
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('Google')}
                disabled={loading}
                sx={{
                  borderColor: '#555',
                  color: '#ccc',
                  '&:hover': {
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    color: '#00ff88',
                  },
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin('Facebook')}
                disabled={loading}
                sx={{
                  borderColor: '#555',
                  color: '#ccc',
                  '&:hover': {
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    color: '#00ff88',
                  },
                }}
              >
                Facebook
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AppleIcon />}
                onClick={() => handleSocialLogin('Apple')}
                disabled={loading}
                sx={{
                  borderColor: '#555',
                  color: '#ccc',
                  '&:hover': {
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    color: '#00ff88',
                  },
                }}
              >
                Apple
              </Button>
            </Box>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    color: '#00ff88',
                    fontWeight: 'medium',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      textShadow: '0 0 5px rgba(0, 255, 136, 0.5)',
                    },
                  }}
                >
                  Sign up for free
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;