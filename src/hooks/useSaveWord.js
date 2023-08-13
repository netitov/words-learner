import { useDispatch } from 'react-redux';
import { addNewWords } from '../store/userWords';
import { addToList } from '../utils/api';

function useSaveWord() {
  const dispatch = useDispatch();

  const saveWord = async (obj) => {
    const token = localStorage.getItem('token');
    const arr = [obj];
    const response = await addToList(arr, token);
    if (response.err) {
      console.log(response.err);
      return response.err;
    } else {
      dispatch(addNewWords(arr));
      return response.data;
    }
  };

  return saveWord;
}

export default useSaveWord;
