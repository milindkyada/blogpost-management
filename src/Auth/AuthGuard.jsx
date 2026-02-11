import { Navigate } from "react-router-dom";

const AuthGuard = ({
  children,
  required = true,
  redirectTo = "/Login",
}) => {
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  const isAuthenticated = !!loginData;

  if (required && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!required && isAuthenticated) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
};

export default AuthGuard;