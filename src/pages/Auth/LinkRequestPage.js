import React from 'react';
import LinkRequest from '../../components/Auth/LinkRequest';
import Footer from '../../components/Footer/Footer';
import AuthHeader from '../../components/AuthHeader/AuthHeader';


function LinkRequestPage() {
  return (
    <div className='login-page'>
      <AuthHeader />
      <LinkRequest />
      <Footer />
    </div>
  )
}

export default LinkRequestPage;
