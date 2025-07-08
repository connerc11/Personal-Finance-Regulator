import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, GitHub } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading } = useAuth();
  
  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      
      // Redirect to intended page or dashboard after successful registration
      navigate(from, { replace: true });
    } catch (error) {
      // Display the specific error message from AuthContext
      setErrors({ general: error instanceof Error ? error.message : 'Registration failed. Please try again.' });
    }
  };

  const handleSocialSignup = (provider: string) => {
    // Placeholder for social authentication
    setErrors({ general: `${provider} signup will be implemented with backend integration` });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 3, color: '#00ff88' }}>
            Join Personal Finance Regulator to start managing your finances
          </Typography>

          {errors.general && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                color: '#ff6b6b',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b',
                },
              }}
            >
              {errors.general}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                name="firstName"
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={isLoading}
                sx={{
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
                    '&.Mui-error fieldset': {
                      borderColor: '#ff6b6b',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#888',
                    '&.Mui-focused': {
                      color: '#00ff88',
                    },
                    '&.Mui-error': {
                      color: '#ff6b6b',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ff6b6b',
                  },
                }}
              />
              <TextField
                name="lastName"
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={isLoading}
                sx={{
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
                    '&.Mui-error fieldset': {
                      borderColor: '#ff6b6b',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#888',
                    '&.Mui-focused': {
                      color: '#00ff88',
                    },
                    '&.Mui-error': {
                      color: '#ff6b6b',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ff6b6b',
                  },
                }}
              />
            </Box>
            
            <TextField
              name="username"
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLoading}
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
                  '&.Mui-error fieldset': {
                    borderColor: '#ff6b6b',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': {
                    color: '#00ff88',
                  },
                  '&.Mui-error': {
                    color: '#ff6b6b',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                },
              }}
            />
            
            <TextField
              name="email"
              type="email"
              fullWidth
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
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
                  '&.Mui-error fieldset': {
                    borderColor: '#ff6b6b',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': {
                    color: '#00ff88',
                  },
                  '&.Mui-error': {
                    color: '#ff6b6b',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                },
              }}
            />
            
            <TextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
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
                  '&.Mui-error fieldset': {
                    borderColor: '#ff6b6b',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': {
                    color: '#00ff88',
                  },
                  '&.Mui-error': {
                    color: '#ff6b6b',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                },
              }}
              InputProps={{
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
            />
            
            <TextField
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={isLoading}
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
                  '&.Mui-error fieldset': {
                    borderColor: '#ff6b6b',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': {
                    color: '#00ff88',
                  },
                  '&.Mui-error': {
                    color: '#ff6b6b',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#00ff88' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
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
              {isLoading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Create Account'}
            </Button>

            <Divider sx={{ my: 2, borderColor: '#333' }}>
              <Typography variant="body2" sx={{ color: '#888' }}>
                or sign up with
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={() => handleSocialSignup('Google')}
                disabled={isLoading}
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
                startIcon={<GitHub />}
                onClick={() => handleSocialSignup('GitHub')}
                disabled={isLoading}
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
                GitHub
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Already have an account?{' '}
                <Link 
                  component={RouterLink}
                  to="/login" 
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
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;