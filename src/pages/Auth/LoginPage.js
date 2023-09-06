import React from 'react';
import Login from '../../components/Auth/Login';
import Footer from '../../components/Footer/Footer';
import AuthHeader from '../../components/AuthHeader/AuthHeader';

function LoginPage() {
  return (
    <div className='login-page'>
      <AuthHeader />
      <Login />
      <Footer />
    </div>
  );
}

export default LoginPage;
