import React, { useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import SideNav from '../../components/Navigation/SideNav';
import CardNav from '../../components/Navigation/CardNav';
import { accountNav } from '../../utils/constants';

function Account() {

  const location = useLocation().pathname.replace('/account', '');
  console.log(location);

  const getCurrLocation = useMemo(() => {
    if (location === '') {
      return 'My account';
    } else {
      return accountNav.find((i) => i === location)?.title || 'Not found';
    }
  }, [location]);


  return (
    <div className='account-page'>
      <AuthHeader />
      <h2>{getCurrLocation}</h2>
      <div className='account-page__box'>
        <SideNav route={getCurrLocation}/>
        <Routes>
          <Route path='/' element={<CardNav />} />
          <Route path='/translator' element={<CardNav />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default Account;
