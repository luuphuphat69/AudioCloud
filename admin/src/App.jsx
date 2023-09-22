import { BrowserRouter as Router, Routes, Route }from 'react-router-dom';
import './App.css';

import Users from './pages/user_management';
import Login from './pages/login';

function App() {

  return (
  <Router>
    <Routes>
        <Route path='/usermanagement' element={<Users />} />
        <Route path='/login' element={<Login />} />
    </Routes>
  </Router>
  );
}

export default App
