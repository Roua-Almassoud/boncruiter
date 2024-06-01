import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-phone-input-2/lib/style.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';

export default function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    localStorage.removeItem('userId');
    navigate('/');
  }, []);
  return (
    <>
      {loading && <Loader />}
      <>
        <Navbar navClass="defaultscroll sticky" />

        <Footer />
        <ScrollTop />
      </>
    </>
  );
}
