import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VscAccount } from 'react-icons/vsc';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function Login() {

  const [resetPassActive, setResetPassActive] = useState(false);

  return (
    <div className='auth'>
      <div className='auth__form-wrapper'>

        <div className='auth__img-box'>
          <VscAccount />
          <h2>{!resetPassActive ? 'Log in' : 'Restore password'}</h2>
        </div>
        <p className='auth__mode-switch'>Don't have an account?
          <Link to='/signup' className='auth__mode-btn'>Sign up</Link>
        </p>

        {!resetPassActive ? (
          <form className='auth__form'>
            <TextField
              id='email'
              label='Email'
              type='email'
              variant='standard'
              className='auth__input'
            />
            <TextField
              id='password'
              label='Password'
              type='password'
              autoComplete='on'
              variant='standard'
              className='auth__input'
            />
            <button type='submit' className='auth__sbt-btn'>Sign in</button>
            <div className='auth__pass-box'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' className='auth__checkbox' />
              <a to='#' className='auth__pass-btn' onClick={() => setResetPassActive(true)}>
                <span>Forgot password?</span>
              </a>
            </div>
          </form>
        ) : (
          <form className='auth__form'>
            <p className='auth__description'>Enter your account email, and we'll send you a link to reset your password</p>
            <TextField
              id='email'
              label='Email'
              type='email'
              variant='standard'
              className='auth__input'
            />
            <button type='submit' className='auth__sbt-btn'>Send reset link</button>
            <div className='auth__pass-box'>
            <a to='#' type='button' className='auth__pass-btn' onClick={() => setResetPassActive(false)}>
              <span>&larr; Back to login</span>
            </a>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}

export default Login;
