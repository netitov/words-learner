import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VscAccount } from 'react-icons/vsc';
import TextField from '@mui/material/TextField';

function Signup() {


  return (
    <div className='auth'>
      <div className='auth__form-wrapper'>

        <div className='auth__img-box'>
          <VscAccount />
          <h2>Sign up</h2>
        </div>
        <p className='auth__mode-switch'>Already have an account?
          <Link to='/login' className='auth__mode-btn'>Log in</Link>
        </p>
        <form className='auth__form'>
          <TextField
            id='username'
            label='User name'
            type='text'
            variant='standard'
            className='auth__input'
          />
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
          <TextField
            id='confirmpassword'
            label='Confirm password'
            type='password'
            autoComplete='on'
            variant='standard'
            className='auth__input'
          />
          <button type='submit' className='auth__sbt-btn'>Sign up</button>
        </form>

      </div>
    </div>
  )
}

export default Signup;
