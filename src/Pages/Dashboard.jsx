import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!localStorage.getItem('loginData')) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('loginData');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>{user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;