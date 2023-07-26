import React from 'react';
import { VscAccount } from 'react-icons/vsc';
import TextField from '@mui/material/TextField';

function Login() {
  return (
    <div className='auth'>
      <div className='auth__form-wrapper'>

        <div className='auth__img-box'>
          <VscAccount />
          <h2>Log in</h2>
        </div>
        <p className='auth__mode-switch'>Don't have an account? <button type='button'>Sign up</button></p>

        <form className='auth__form'>
          <TextField
            id='standard-basic'
            label='Email'
            type='email'
            variant='standard'
          />
          <TextField
            id='standard-basic'
            label='Password'
            type='password'
            variant='standard'
          />
          <button type='submit' className='auth__sbt-btn'></button>
          <div className='auth__pass-box'>
            <input className='auth__checkbox' type='checkbox'  id='remember' name='remember'></input>
            <label className='auth__checkbox-label' htmlFor='remember'>Remember me</label>
            <p>Forgot password?</p>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Login;
