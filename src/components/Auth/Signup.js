import React, { useState } from 'react';
import AuthForm from "./AuthForm";

function Signup() {

  const [data, setData] = useState({});
  const [error, setError] = useState({});

  const textFieldsData = [
    { id: 'userName', name: 'userName', label: 'User name', type: 'text', required: true },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
    { id: 'password', name: 'password', label: 'Password', type: 'password', autoComplete: 'on', required: true },
    { id: 'confirmPassword', name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'on', required: true },
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
      form='Sign up'
      question='Already have an account?'
      route='/login'
      refBtn='Log in'
      btnText='Sign up'
      error={error}
      setError={setError}
    />
  )
}

export default Signup;
