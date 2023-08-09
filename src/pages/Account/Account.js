import React, { useMemo, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import SideNav from '../../components/Navigation/SideNav';
import CardNav from '../../components/Navigation/CardNav';
import Translate from '../../components/Translator/Translator';
import Frequency from '../../components/Frequency/Frequency';
import { accountNav } from '../../utils/constants';

function Account() {

  const [translatorHeight, setTranslatorHeight] = useState(400);
  const location = useLocation().pathname;

  //current route for display in heading and navigation
  const getCurrentElement = useMemo(() => {
      return accountNav.find((i) => i.route === location);
  }, [location]);

  //expand translation container for fitting languages box
  function handleTranslatorHeight(height) {
    if(height > 0) {
      setTranslatorHeight(height + 42);
    } else {
      setTranslatorHeight(400);
    }
  }


  return (
    <div className='account-page'>
      <AuthHeader />
      <div className='account-page__heading-box'>
        <h2 className='account-page__heading'>{getCurrentElement?.title}</h2>
        {getCurrentElement?.icon}
      </div>

      <div className='account-page__box' style={{ minHeight: translatorHeight + 'px' }}>
        <SideNav route={getCurrentElement?.route}/>
        <Routes>
          <Route path='/navigation' element={<CardNav />} />
          <Route
            path='/translator'
            element={
              <Translate
                account={true}
                onHeightChange={handleTranslatorHeight}
                chartColor='#dbecec73'
                chartFontColor='#fff'
                columnChartColor='#ffd987'
                columnChartStroke='#bebebe'
              />
            }
          />
          <Route path='/frequency' element={<Frequency account={true} />} />
          <Route path='/*' element={<CardNav />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default Account;
