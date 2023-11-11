import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
import TermsOfUse from './pages/terms-of-use';
import ProtectedProfileRoute from './component/authen/ProtectedProfileRoute';
import ProtectedUploadRoute from './component/authen/ProtectedUploadRoute';

function App() {
  return (
    <Router>
      <APlayerProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/details/:audioId" element={<Details />} />
          <Route path='/home' exact element={<Home />} />
          <Route path='/profile' element={<ProtectedProfileRoute />}/>
          <Route path='/login' element={<Login />} />
          <Route path='/search' element={<Search />} />
          <Route path='/subcription' element={<Subcription/>}/>
          <Route path='/upload' element={<ProtectedUploadRoute />} />
          <Route path='/register' element={<Register />} />
          <Route path='/terms-of-use' element={<TermsOfUse />} />
        </Routes>
      </APlayerProvider>
    </Router>
  );
}

export default App;