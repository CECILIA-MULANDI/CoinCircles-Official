import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isConnected = !!localStorage.getItem('walletAddress');

  return isConnected ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
