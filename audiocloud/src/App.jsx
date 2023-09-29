import { BrowserRouter as Router, Routes, Route, Navigate}from 'react-router-dom';
import './App.css'

import Login from './pages/login'
import Register from './pages/register';
import Home from './pages/home';

function App() {
  return (
    <Router>
    <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path='/home' exact Component={Home} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register />} />
    </Routes>
  </Router>
  );
}

export default App;
