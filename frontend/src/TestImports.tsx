import React from 'react';

// Test each import individually
console.log('Testing imports...');

try {
  const Login = require('./pages/Login').default;
  console.log('Login import:', typeof Login, Login.name);
} catch (error) {
  console.error('Login import error:', error.message);
}

try {
  const Signup = require('./pages/Signup').default;
  console.log('Signup import:', typeof Signup, Signup.name);
} catch (error) {
  console.error('Signup import error:', error.message);
}

try {
  const Dashboard = require('./pages/Dashboard').default;
  console.log('Dashboard import:', typeof Dashboard, Dashboard.name);
} catch (error) {
  console.error('Dashboard import error:', error.message);
}

try {
  const Profile = require('./pages/Profile').default;
  console.log('Profile import:', typeof Profile, Profile.name);
} catch (error) {
  console.error('Profile import error:', error.message);
}

try {
  const Budgets = require('./pages/Budgets').default;
  console.log('Budgets import:', typeof Budgets, Budgets.name);
} catch (error) {
  console.error('Budgets import error:', error.message);
}

try {
  const Transactions = require('./pages/Transactions').default;
  console.log('Transactions import:', typeof Transactions, Transactions.name);
} catch (error) {
  console.error('Transactions import error:', error.message);
}

try {
  const Goals = require('./pages/Goals').default;
  console.log('Goals import:', typeof Goals, Goals.name);
} catch (error) {
  console.error('Goals import error:', error.message);
}

try {
  const CashCoach = require('./pages/CashCoach').default;
  console.log('CashCoach import:', typeof CashCoach, CashCoach.name);
} catch (error) {
  console.error('CashCoach import error:', error.message);
}

try {
  const Layout = require('./components/Layout').default;
  console.log('Layout import:', typeof Layout, Layout.name);
} catch (error) {
  console.error('Layout import error:', error.message);
}

export default function TestComponent() {
  return <div>Test Component</div>;
}
