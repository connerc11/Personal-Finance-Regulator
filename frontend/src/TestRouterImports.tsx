import { Link, useLocation, useNavigate, MemoryRouter } from 'react-router-dom';

// This file should compile without errors if React Router is working correctly
console.log('React Router imports working:', { Link, useLocation, useNavigate, MemoryRouter });

export default function TestRouterImports() {
  return <div>Router imports test</div>;
}
