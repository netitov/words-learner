import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';

function RestorePass() {
  const [data, setData] = useState({});

  const textFieldsData = [
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
  ];

  function submitForm() {
    console.log(data)
  }

  return (
    <AuthForm
      textFieldsData={textFieldsData}
      data={data}
      setData={setData}
      submitForm={submitForm}
      form='Restore password'
      question="Don't have an account?"
      route='/signup'
      refBtn='Sign up'
      btnText='Send reset link'
      addElement={<p className='auth__description'>Enter your account email, and we'll send you a link to reset your password</p>}
    >
      <div className='auth__pass-box'>
            <button to='#' type='button' className='auth__pass-btn'>
              <Link to='/login'>&larr; Back to login</Link>
            </button>
            </div>
    </AuthForm>
  )
}

export default RestorePass;
