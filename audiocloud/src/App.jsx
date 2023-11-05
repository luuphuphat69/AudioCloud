import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { APlayerProvider } from './component/player_context';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Login from './pages/login'
import Register from './pages/register';
import Home from './pages/home';
import Search from './pages/search';
import Upload from './pages/upload';
import Profile from './pages/profile';
import Details from './pages/song_details';
import Subcription from './pages/subcription';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Fetch the token when the component mounts
    const fetchToken = async () => {
      try {
        const response = await axios.get('http:/audiocloud.asia:8000/get-cookies', { withCredentials: true }); // Get Cookies data
        const receivedToken = response.data;
        setToken(receivedToken);

        // Check the login status once the token is available
        checkLoginStatus();
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, [isLoggedIn]);

  const checkLoginStatus = () => {
    // Check if the token exists and update the login status
    if (token) {
      setIsLoggedIn(true);
      console.log(isLoggedIn);
    } else {
      setIsLoggedIn(false);
      console.log(isLoggedIn);
    }
  };

  return (
    <Router>
      <APlayerProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/details/:audioId" element={<Details />} />
          <Route path='/home' exact element={<Home />} />
          <Route path='/profile' element={isLoggedIn === false ? <Profile /> : <Navigate to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/search' element={<Search />} />
          <Route path='/subcription' element={<Subcription/>}/>
          <Route path='/upload' element={isLoggedIn === false ? <Upload /> : <Navigate to="/login" />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </APlayerProvider>
    </Router>
  );
}

export default App;