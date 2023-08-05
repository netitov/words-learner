import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';
import { linkRequest } from '../../utils/api';

function LinkRequest() {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [isSent, setIsSent] = useState(false);

  const textFieldsData = [
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
  ];

  async function submitForm() {
    const response = await linkRequest(data);
    const { serverError } = response;
    if (response.error) {
      //error text
      setError({ serverError });
    } else {
      setIsSent(true);
    }
  }

  return (
    <AuthForm
      textFieldsData={textFieldsData}
      data={data}
      setData={setData}
      submitForm={submitForm}
      form='Password reset'
      question="Don't have an account?"
      route='/signup'
      refBtn='Sign up'
      btnText='Send reset link'
      addElement={<p className='auth__description'>Enter your account email, and we'll send you a link to reset your password</p>}
      error={error}
      setError={setError}
    >
      <div className={`auth__result-box${isSent ? ' auth__result-box_active' : ''}`}>
        <p>&#10003; The reset link has been sent. Please check your email account</p>
      </div>

      <div className='auth__pass-box'>
        <button to='#' type='button' className='auth__pass-btn'>
          <Link to='/login'>&larr; Back to login</Link>
        </button>
      </div>
    </AuthForm>
  )
}

export default LinkRequest;
