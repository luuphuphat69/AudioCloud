import { BrowserRouter as Router, Routes, Route }from 'react-router-dom';
import './App.css';

import Users from './pages/user_management';
import Login from './pages/login';
import Audios from './pages/audio_management';

function App() {

  return (
  <Router>
    <Routes>
        <Route path='/user-management' element={<Users />} />
        <Route path='/audio-management' element={<Audios />} />
        <Route path='/login' element={<Login />} />
    </Routes>
  </Router>
  );
}

export default App
