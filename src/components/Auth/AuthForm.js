import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VscAccount } from 'react-icons/vsc';
import TextField from '@mui/material/TextField';
import Spinner from '../Spinner/Spinner';

function AuthForm({ textFieldsData, data, setData, submitForm, children, form, question,
  route, refBtn, btnText, addElement, error, setError }) {

  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorActive, setErrorActive] = useState(false);

  const formRef = useRef();

  function checkValidation(name, value, message) {
    if (name === 'email' && value !== '' && message !== '') {
      return 'Invalid email. Please try again';
    }

    if (value === '') {
      return 'Please fill in all fields';
    }

    if (name === 'password' && value !== '' && message !== '')  {
      return 'Password must be at least 7 characters long';
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
    //show error onBlur
    const validation = checkValidation(name, value, e.target.validationMessage);
    if (validation !== '') {
      //set auto validation message
      setError({ ...error, [name]: validation });
    }
  }

  //hide error on input change
  async function hideError(e) {
    const { name, value } = e.target;

    if ((name === 'password' && value === data.confirmPassword) || (name === 'confirmPassword' && value === data.password)) {
      const { confirmPassword: confirmPass, password: pass, ...rest } = error;
      setError(rest);
      console.log(name, value, data.password)
    } else if (e.target.validationMessage === '' && error[name]) {
      const { [name]: removedErr, ...rest } = error;
      setError(rest);
    }

    if (error.serverError) {
      const { serverError, ...rest } = error;
      setError(rest);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      if (!errorActive) {
        setErrorActive(true);
      }
    } else if (!isLoading) {
      setIsLoading(true);
      await submitForm();
      setIsLoading(false);
    }

  }

  function test() {
    //console.log(data)
    //console.log(error)
  }

  //toggle error
  useEffect(() => {
    if (Object.values(error).some((i) => i !== '')) {
      setErrorActive(true);
      setIsValid(false);
    } else {
      setErrorActive(false);
      setIsValid(true);
    }
  }, [error])

  return (
    <div className='auth' onClick={test}>
      <div className='auth__form-wrapper'>
        <div className='auth__img-box'>
          <VscAccount />
          <h2>{form}</h2>
        </div>
        <p className='auth__mode-switch'>{question}
          <Link to={route} className='auth__mode-btn'>{refBtn}</Link>
        </p>

        <form className='auth__form' ref={formRef} onSubmit={onSubmit}>
          {addElement}

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
              onChange={hideError}
              required={field.required}
              inputProps={{ minLength: field.minLength }}
            />
          ))}
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
          <button type='submit' className={`auth__sbt-btn${isLoading ? ' auth__sbt-btn_loading' : ''}`}>
            {btnText}
            <Spinner isLoading={isLoading} />
          </button>
          {children}
        </form>

      </div>
    </div>
  )
}

export default AuthForm;
