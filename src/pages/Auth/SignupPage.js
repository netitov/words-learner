import React from 'react';
import Signup from '../../components/Auth/Signup';
import Footer from '../../components/Footer/Footer';
import AuthHeader from '../../components/AuthHeader/AuthHeader';


function SignupPage() {
  return (
    <div className='login-page'>
      <AuthHeader />
      <Signup />
      <Footer />
    </div>
  )
}

export default SignupPage;
