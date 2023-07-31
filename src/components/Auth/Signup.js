import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VscAccount } from 'react-icons/vsc';
import TextField from '@mui/material/TextField';

function Signup() {

  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState({});
  const [data, setData] = useState({});
  const [errorActive, setErrorActive] = useState(false);

  const formRef = useRef();

  function checkValidation(name, value, message) {
    if (name === 'email' && value !== '' && message !== '') {
      return 'Invalid email. Please try again';
    }

    if (value === '') {
      return 'Please fill in all fields';
    }

    if (name === 'password' && value !== '' && data?.confirmPassword && value !== data.confirmPassword) {
      return 'Passwords do not match';
    }

    if (name === 'confirmPassword' && value !== '' && data?.password && value !== data.password) {
      return 'Passwords do not match';
    }

    return '';
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });

    const validation = checkValidation(name, value, e.target.validationMessage);

    if (validation !== '') {
      setError({ ...error, [name]: validation });
    } else if (name === 'password' || name === 'confirmPassword') {
      const { confirmPassword: confirmPass, password: pass, ...rest } = error;
      setError(rest);
    }else {
      const { [name]: removedProperty, ...rest } = error;
      setError(rest);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    //props.onRegister(data)
  }

  function test() {
    //console.log(data)
    //console.log(error)
  }

  //toggle error
  useEffect(() => {
    if (Object.values(error).some((i) => i !== '')) {
      setErrorActive(true);
    } else {
      setErrorActive(false);
    }
  }, [error])

  const textFieldsData = [
    { id: 'userName', name: 'userName', label: 'User name', type: 'text', required: true },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
    { id: 'password', name: 'password', label: 'Password', type: 'password', autoComplete: 'on', required: true },
    { id: 'confirmPassword', name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'on', required: true },
  ];


  return (
    <div className='auth' onClick={test}>
      <div className='auth__form-wrapper'>

        <div className='auth__img-box'>
          <VscAccount />
          <h2>Sign up</h2>
        </div>
        <p className='auth__mode-switch'>Already have an account?
          <Link to='/login' className='auth__mode-btn'>Log in</Link>
        </p>

        <form className='auth__form' ref={formRef} onSubmit={handleSubmit}>
          <div className={`auth__err-box${errorActive ? ' auth__err-box_active' : ''}`}>
            <div className='auth__err-text-box'>
              {Array.from(new Set(Object.values(error))).map((i) => (
                <p key={i}>{i}</p>
              ))}
            </div>
            <button className='btn-cross' type='button' onClick={() => setErrorActive(false)}>
              <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                <line x1='0' x2='100' y1='0' y2='100' />
                <line x1='0' x2='100' y1='100' y2='0' />
              </svg>
            </button>
          </div>
          {textFieldsData.map((field) => (
            <TextField
              key={field.id}
              id={field.id}
              name={field.name}
              label={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              variant='standard'
              className={`auth__input${field.name in error ? ' auth__input_error' : ''}`}
              onBlur={handleChange}
              required={field.required}
            />
          ))}
          <button type='submit' className='auth__sbt-btn'>Sign up</button>
        </form>

      </div>
    </div>
  )
}

export default Signup;
