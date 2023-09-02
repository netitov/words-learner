import React, { useMemo, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../../components/Footer/Footer';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import SideNav from '../../components/Navigation/SideNav';
import CardNav from '../../components/Navigation/CardNav';
import Translate from '../../components/Translator/Translator';
import Frequency from '../../components/Frequency/Frequency';
import WordList from '../../components/WordList/WordList';
import { accountNav } from '../../utils/constants';
import Collections from '../../components/Collections/Collections';
import Progress from '../../components/Progress/Progress';

function Account() {

  const [collectLocation, setCollectLocation] = useState('');
  const location = useLocation().pathname;
  const collectionPattern = /^\/account\/words\/collections\/.*/;

  const collections = useSelector((state) => state.collections);

  //current route for display in heading and navigation
  const getCurrentElement = useMemo(() => {
      return accountNav.find((i) => location.startsWith(i.route));
  }, [location]);


  //update current collection
  useEffect(() => {
    if (collectionPattern.test(location)) {
      const currentCollectionId = location.substring(location.lastIndexOf('/') + 1);
      setCollectLocation(collections.find((i) => i._id === currentCollectionId)?.collectionName);
    } else if (collectLocation !== '') {
      setCollectLocation('');
    }
  }, [location, collections]);

  return (
    <div className='account-page'>
      <AuthHeader />
      <div className='account-page__heading-box'>
        <h2 className='account-page__heading'>{getCurrentElement?.title}</h2>
        {getCurrentElement?.icon}
        {collectLocation && (
          <p className='account-page__location'>
            <Link to='/account/collections'>All collections</Link> &#8811; &nbsp;
            <span>{collectLocation}</span>
          </p>
        )}

      </div>

      <div className='account-page__box'>
        <SideNav route={getCurrentElement?.route}/>
        <Routes>
          <Route path='/navigation' element={<CardNav />} />
          <Route
            path='/translator'
            element={
              <Translate
                account={true}
                chartColor='#dbecec73'
                chartFontColor='#fff'
                columnChartColor='#ffd987'
                columnChartStroke='#bebebe'
              />
            }
          />
          <Route path='/frequency' element={<Frequency account={true} />} />
          <Route path='/words' element={<WordList />} />
          <Route path='/collections' element={<Collections />} />
          <Route path='/words/collections/*' element={<WordList />} />
          <Route path='/progress' element={<Progress />} />
          <Route path='/*' element={<CardNav />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default Account;
