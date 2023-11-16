import { Link, Navigate } from 'react-router-dom';
import Users from '../pages/user_management';
const ProtectedUserRoute = () => {

    const token = localStorage.getItem('token');
  
    if (token) {
      // User is authenticated, allow access to the "/upload" route
      return <Users/>;
    } else {
      // User is not authenticated, redirect to the login page
      return <Navigate to="/login" />;
    }
};

export default ProtectedUserRoute;
