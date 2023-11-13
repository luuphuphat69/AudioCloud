import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

import Users from './pages/user_management';
import Login from './pages/login';
import Audios from './pages/audio_management';

function App() {
  return (
    <Router>
      <Routes>
        {/* Set the default route to the /login page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Other routes */}
        <Route path='/user-management' element={<Users />} />
        <Route path='/audio-management' element={<Audios />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
