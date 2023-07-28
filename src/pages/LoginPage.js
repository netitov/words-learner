import React from 'react';
import Login from '../components/Login/Login';
import Footer from '../components/Footer/Footer';
import AuthHeader from '../components/AuthHeader/AuthHeader';


function LoginPage() {
  return (
    <>
      <AuthHeader />
      <Login />
      <Footer />
    </>
  )
}

export default LoginPage;
