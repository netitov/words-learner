import React from 'react';
import PasswordReset from '../../components/Auth/PasswordReset';
import Footer from '../../components/Footer/Footer';
import AuthHeader from '../../components/AuthHeader/AuthHeader';

function PasswordResetPage() {
  return (
    <div className='login-page'>
      <AuthHeader />
      <PasswordReset />
      <Footer />
    </div>
  );
}

export default PasswordResetPage;
