import { Link, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Audios from '../pages/audio_management';
const ProtectedAudioRoute = () => {

    const cookies = new Cookies();
    const token = cookies.get('token');
  
    if (token) {
      // User is authenticated, allow access to the "/upload" route
      return <Audios />;
    } else {
      // User is not authenticated, redirect to the login page
      return <Navigate to="/login" />;
    }
};

export default ProtectedAudioRoute;
