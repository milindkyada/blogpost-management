import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loginData');
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default AuthGuard;