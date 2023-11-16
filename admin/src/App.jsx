import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import ProtectedUserRoute from './authen/ProtectedUserRoute';
import ProtectedAudioRoute from './authen/ProtectedAudioRoute';
import ProtectedBillingRoute from './authen/ProtectedBillingRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/billing' element={<ProtectedBillingRoute/>}/>
        <Route path='/user-management' element={<ProtectedUserRoute/>} />
        <Route path='/audio-management' element={<ProtectedAudioRoute/>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
