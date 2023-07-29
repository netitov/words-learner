import React from 'react';
import Login from '../components/Login/Login';
import Footer from '../components/Footer/Footer';
import AuthHeader from '../components/AuthHeader/AuthHeader';


function LoginPage() {
  return (
    <div className='login-page'>
      <AuthHeader />
      <Login />
      <Footer />
    </div>
  )
}

export default LoginPage;
