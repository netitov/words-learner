import React from 'react';
import RestorePass from '../../components/Auth/RestorePass';
import Footer from '../../components/Footer/Footer';
import AuthHeader from '../../components/AuthHeader/AuthHeader';


function RestorePassPage() {
  return (
    <div className='login-page'>
      <AuthHeader />
      <RestorePass />
      <Footer />
    </div>
  )
}

export default RestorePassPage;
