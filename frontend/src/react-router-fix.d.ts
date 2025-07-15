// Type declaration fix for React Router components
declare module 'react-router-dom' {
  export const Routes: React.ComponentType<any>;
  export const Route: React.ComponentType<any>;
  export const Navigate: React.ComponentType<any>;
  export const BrowserRouter: React.ComponentType<any>;
}
