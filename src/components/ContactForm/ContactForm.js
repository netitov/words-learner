import React, { useEffect, useState } from 'react';

import Spinner from '../Spinner/Spinner';
import Snackbar from '../Snackbar/Snackbar';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import emailjs from '@emailjs/browser';

function ContactForm(props) {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState({ undefined });
  const [data, setData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [form, setForm] = useState();
  const [inSend, setInSend] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [snackbarActive, setSnackbarActive] = useState(false);
  const [snackbarErrorActive, setSnackbarErrorActive] = useState(false);


  function handleChange(e) {
    const { name, value } = e.target;
    setForm(e.target.closest('form'));

    const checkValidation = () => {
      if (name === 'email' && value !== '' && e.target.validationMessage !== '') {
        return 'invalid email. Pleasy try again';
      }
      if (value === '') {
        return 'please fill in this field';
      }
      return '';
    };
    setError({ ...error, [name]: checkValidation() });
    setData({
      ...data,
      [name]: value,
    });
    setIsValid(e.target.closest('form').checkValidity());
  }

  function sendEmail(e) {
    e.preventDefault();
    setInSend(true);

    emailjs.sendForm(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID, form, process.env.REACT_APP_PUBLIC_KEY)
      .then((result) => {
        console.log(result.text);
        setInSend(false);
        setIsSent(true);
        setSnackbarActive(true);

        setTimeout(() => {
          setSnackbarActive(false);
          setIsSent(false);
        }, 3000)

      }, (error) => {
        setIsSent(false);
        setInSend(false);
        setSnackbarActive(false);

        setSnackbarErrorActive(true);
        setTimeout(() => {
          setSnackbarErrorActive(false);
        }, 3000)

      });
  };

  //drop form data
  useEffect(() => {
    function resetForm() {
      if (isSent) {
        setIsValid(false);
        form.reset();
      }
    }
    resetForm();
  }, [isSent]);


  return (
    <div className={`contact${props.formActive ? ' contact_active' : ''}`}>

      <div className='contact__container'>

        <div className='form'>
          <form className='form__body' onSubmit={sendEmail} id='form'>

            <div className='form__item'>
              <input
                id='formName'
                type='text'
                name='name'
                className='form__input _req'
                onChange={handleChange}
                required
                maxLength='30'
              />
              <label
                htmlFor='formName'
                className={error.name !== '' && error.name !== undefined ? 'form__label form__label_active' : 'form__label'}
              >
                Name*:
                {' '}
                {error.name}
              </label>
            </div>

            <div className='form__item'>
              <input
                id='formEmail'
                type='email'
                required
                name='email'
                className='form__input _req _email'
                onChange={handleChange}
              />
              <label
                htmlFor='formEmail'
                className={error.email !== '' && error.email !== undefined ? 'form__label form__label_active' : 'form__label'}
              >
                E-mail*:
                {' '}
                {error.email}
              </label>
            </div>

            <div className='form__item'>
              <textarea
                id='formMessage'
                name='message'
                required
                className='form__input form__area _req'
                onChange={handleChange}
              />
              <label
                htmlFor='formMessage'
                className={
                  error.message !== '' && error.message !== undefined ? 'form__label form__label-area form__label-area_active'
                    : 'form__label form__label-area'
                }
              >
                {' '}
                Message*:
                {' '}
                {error.message}
              </label>
            </div>

            <button type='submit' className={isValid && !inSend ? 'form__button form__button_active' : 'form__button'}>Send</button>

          </form>
          <Spinner isLoading={inSend}/>
          <p className='contact__text contact__text_form'>Please fill out the form</p>
          <button className='form__close-btn btn-cross' type='button' onClick={props.toggleForm}>
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <line x1='0' x2='100' y1='0' y2='100' />
              <line x1='0' x2='100' y1='100' y2='0' />
            </svg>
          </button>
        </div>

      </div>

      {/* snackbar if message sent */}
      <Snackbar
        snackbarActive={snackbarActive}
        class='contact__snack'
        text='Message sent!'
      >
        <IoCheckmarkCircleOutline size={22} />
      </Snackbar>

      {/* snackbar if message is not sent */}
      <Snackbar
        snackbarActive={snackbarErrorActive}
        class='contact__snack-error'
        text='Something went wrong, please try again later'
      >
        <IoCheckmarkCircleOutline size={22} />
      </Snackbar>

    </div>
  );
}

export default ContactForm;
