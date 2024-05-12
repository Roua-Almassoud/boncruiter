import React from 'react';
import { Route, Routes } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/style.scss';
import './assets/css/materialdesignicons.min.css';
import Index from './pages/Index';
import Signup from './pages/signup';
import UploadCV from './pages/upload';
import Profile from './pages/profile';
import VeriyAccount from './pages/verify-account';

function App() {
  const userId = localStorage.getItem('userId')
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Index />} />
        <Route path="/index" exact element={<Index />} />
        <Route path="/signup" exact element={<Signup />} />
      
        <Route path="/upload" exact element={<UploadCV />} />
        <Route path="/profile" exact element={<Profile />} />
        <Route path="/verify-account" exact element={<VeriyAccount />} />
      </Routes>
    </>
  );
}

export default App;
