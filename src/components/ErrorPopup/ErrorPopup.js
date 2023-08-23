import React, { useEffect } from 'react';
import Snackbar from '../Snackbar/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { closeError } from '../../store/error';
import { motion } from 'framer-motion';

function ErrorPopup() {

  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.error.errorMessage);

  // close error on overlay click
  useEffect(() => {
    function handleOverlayClick (e) {
      if (e.target.classList[0] === 'error-popup') {
        dispatch(closeError());
      }
    };

    if (errorMessage) {
      document.addEventListener('click', handleOverlayClick);
    }

    return () => {
      document.removeEventListener('click', handleOverlayClick);
    };
  }, [errorMessage]);

  return (
    <motion.div
      className='error-popup'
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}>
      <Snackbar
        snackbarActive={true}
        elClass='error-popup__snack'
        closeSnack={() => dispatch(closeError())}
        closeBtnColor='#fff'
        text={errorMessage}
      />
    </motion.div>
  )
}

export default ErrorPopup;
