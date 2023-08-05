import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';
import { updatePassword } from '../../utils/api';

function PasswordReset() {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [countdown, setCountdown] = useState(4);
  const [modalActive, setModalActive] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (modalActive && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (modalActive && countdown <= 0) {
      navigate('/login');
    }

  }, [modalActive, countdown]);

  const textFieldsData = [
    { id: 'password', name: 'password', label: 'Password', type: 'password', autoComplete: 'on', required: true, minLength: '7' },
    { id: 'confirmPassword', name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'on', required: true },
  ];

  async function submitForm() {
    //leave only key password
    const { confirmPassword, ...rest } = data;
    const response = await updatePassword(params, rest);
    const { serverError } = response;

    if (response.error) {
      //error text
      setError({ serverError });
    } else {
      setModalActive(true);
    }
  }

  return (
    <>
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
      addElement={<p className='auth__description'>Please enter your new password below to reset your password</p>}
      error={error}
      setError={setError}
    >
    </AuthForm>
    {modalActive && (
      <div className='auth__modal'>
        <div className='auth__modal-box'>
          <div>
            <div className='success-icon'>
              <div className='success-icon__tip'></div>
              <div className='success-icon__long'></div>
            </div>
          </div>
          <p>Password successfully changed!</p>
          <p>
            You will be redirected to the {' '}
            <span className='auth__mode-switch'>
              <Link to='/login' className='auth__mode-btn'>Log in</Link>
            </span> {countdown} sec
          </p>
        </div>
        <button className='auth__close-btn btn-cross' type='button' onClick={() => setModalActive(false)}>
          <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <line x1='0' x2='100' y1='0' y2='100' />
            <line x1='0' x2='100' y1='100' y2='0' />
          </svg>
        </button>
      </div>
    )}
    </>
  )
}

export default PasswordReset;
