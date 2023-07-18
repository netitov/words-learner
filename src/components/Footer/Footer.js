import React, { useState, useEffect } from 'react';
import ContactForm from '../ContactForm/ContactForm';

function Footer() {

  const [formActive, setFormActive] = useState(false);

  function toggleForm() {
    setFormActive(!formActive);
  }

  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        setFormActive(false);
      }
    }

    function handleOverlayClose(e) {
      if (e.target.classList[1] === 'contact_active' || e.target.classList[0] === 'contact__container') {
        setFormActive(false);
      }
    }
    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOverlayClose);

    return () => {
      document.removeEventListener('keyup', handleEscClose);
      document.removeEventListener('click', handleOverlayClose);
    };
  }, [])

  return (
    <footer className='footer'>
      <div className='footer__container'>
        <p className='footer__copyright'>&copy; 2023 Created by
          <a href='https://netitov.ru/' target='_blank' rel='noreferrer' title='open contact form'>NT</a>
        </p>
        <button className='footer__fb-btn' type='button' onClick={toggleForm}>For any questions and feedback</button>
        <ContactForm
          formActive={formActive}
          toggleForm={toggleForm}
        />
      </div>

    </footer>
  )
}

export default Footer;
