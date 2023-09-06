import React, { useState } from 'react';
import AuthForm from './AuthForm';
import { signup } from '../../utils/api';
import useAuth from '../../hooks/useAuth';

function Signup() {
  const [data, setData] = useState({});
  const [error, setError] = useState({});

  const { handleLogin } = useAuth();

  const textFieldsData = [
    { id: 'userName', name: 'userName', label: 'User name', type: 'text', required: true },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
    {
      id: 'password',
      name: 'password',
      label: 'Password',
      type: 'password',
      autoComplete: 'on',
      required: true,
      minLength: '7',
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      label: 'Confirm password',
      type: 'password',
      autoComplete: 'on',
      required: true,
    },
  ];

  async function submitForm() {
    const { confirmPassword, ...rest } = data;
    const response = await signup(rest);
    const { email, userName, token, serverError } = response;

    if (response.error) {
      // error text
      setError({ serverError });
    } else {
      // add token to local storage + save user data in store
      handleLogin(token, email, userName);
    }
  }

  return (
    <AuthForm
      textFieldsData={textFieldsData}
      data={data}
      setData={setData}
      submitForm={submitForm}
      form='Sign up'
      question='Already have an account?'
      route='/login'
      refBtn='Log in'
      btnText='Sign up'
      error={error}
      setError={setError}
    />
  );
}

export default Signup;
