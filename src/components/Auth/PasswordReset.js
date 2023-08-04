import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';

function PasswordReset() {
  const [data, setData] = useState({});
  const [error, setError] = useState({});

  const textFieldsData = [
    { id: 'password', name: 'password', label: 'Password', type: 'password', autoComplete: 'on', required: true, minLength: '7' },
    { id: 'confirmPassword', name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'on', required: true },
  ];

  async function submitForm() {
    /* const response = await authorize(data);
    const { email, userName, token, serverError } = response;

    if (response.error) {
      //error text
      setError({ serverError });
    } else {
      //add token to local storage + save user data in store
      //handleLogin(token, email, userName);
    } */
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
      addElement={<p className='auth__description'>Please enter your new password below to reset your password</p>}
      error={error}
      setError={setError}
    >
    </AuthForm>
  )
}

export default PasswordReset;
