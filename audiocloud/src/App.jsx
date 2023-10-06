import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { APlayerProvider } from './component/player_context';
import Login from './pages/login'
import Register from './pages/register';
import Home from './pages/home';
import Search from './pages/search';

function App() {
  return (
    <Router>
      <APlayerProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path='/home' exact Component={Home} />
          <Route path='/login' element={<Login />} />
          <Route path='/search' element={<Search />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </APlayerProvider>
    </Router>
  );
}

export default App;