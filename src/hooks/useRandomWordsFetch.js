import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRandomWords, setLoading } from '../store/randomWords';
import { setFilters } from '../store/filters';
import { getRandomWords } from '../utils/api';
import { getFreqCat } from '../utils/getFreqCat';
import { showError } from '../store/error';
import { errorMessages } from '../utils/constants';

function useRandomWordsFetch() {
  const dispatch = useDispatch();
  const filtersStore = useSelector((state) => state.filters);

  async function requestRandomWords(filts) {
    dispatch(setLoading(true));
    const filters = filts === undefined ? filtersStore : filts;

    const currLang = JSON.parse(localStorage.getItem('userLang'));
    //add user lang in filters
    const newFilters = {
      ...filters,
      lang: currLang.code,
    };
    //fetch random words
    const response = await getRandomWords(newFilters);

    if (!response.error) {
      //save filters
      dispatch(setFilters(newFilters));
      //convert object
      const newObj = response.map((i) => {
        const frCat = getFreqCat(i.fr);
        return { ...i, frCat };
      });
      //save to storage to avoid repeated fetch
      sessionStorage.setItem('randomWords', JSON.stringify(newObj));
      dispatch(setRandomWords(newObj));

      dispatch(setLoading(false));
      return response;
    } else {
      dispatch(showError(errorMessages.general));
    }

    dispatch(setLoading(false));
  }

  return { requestRandomWords };
}

export default useRandomWordsFetch;
