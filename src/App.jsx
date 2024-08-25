import React, { useEffect, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/style.scss';
import './assets/css/materialdesignicons.min.css';
import Utils from './components/utils/utils';
import Index from './pages/Index';
import Signup from './pages/signup';
import UploadCV from './pages/upload';
import Profile from './pages/profile';
import VeriyAccount from './pages/verify-account';
import Login from './pages/login';
import Logout from './pages/logout';
import PrivateRoutes from './helper/privateRoutes';
import PublicRoutes from './helper/publicRoutes';
import JobList from './pages/jobs';
import JobDetails from "./pages/job-details.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/" exact element={<Index />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/verify-account" exact element={<VeriyAccount />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/" exact element={<Index />} />
          <Route path="/logout" exact element={<Logout />} />
          <Route path="/upload" exact element={<UploadCV />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/jobs" exact element={<JobList />} />
          <Route path="/jobs/:id" exact element={<JobDetails />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
