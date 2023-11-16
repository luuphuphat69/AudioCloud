import { Link, Navigate } from 'react-router-dom';
import Billing from '../pages/billing';
const ProtectedBillingRoute = () => {

  const token = sessionStorage.getItem('token');
  
    if (token) {
      // User is authenticated, allow access to the "/upload" route
      return <Billing/>;
    } else {
      // User is not authenticated, redirect to the login page
      return <Navigate to="/login" />;
    }
};

export default ProtectedBillingRoute;
