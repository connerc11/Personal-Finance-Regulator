// Debug script to check if all imports are valid
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import CashCoach from './pages/CashCoach';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

console.log('Debug imports:');
console.log('Login:', typeof Login, Login);
console.log('Signup:', typeof Signup, Signup);
console.log('Dashboard:', typeof Dashboard, Dashboard);
console.log('Profile:', typeof Profile, Profile);
console.log('Budgets:', typeof Budgets, Budgets);
console.log('Transactions:', typeof Transactions, Transactions);
console.log('Goals:', typeof Goals, Goals);
console.log('CashCoach:', typeof CashCoach, CashCoach);
console.log('Layout:', typeof Layout, Layout);
console.log('AuthProvider:', typeof AuthProvider, AuthProvider);
console.log('useAuth:', typeof useAuth, useAuth);
