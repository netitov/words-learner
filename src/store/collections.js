import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

//remove default value from all collections exept selected
const handleUpdateDefaultState = (collections, updatedCollection) => {
  return collections.map(i => ({
    ...i,
    default: i._id === updatedCollection._id ? updatedCollection.default : false
  }));
};

const handleUpdateCollection = (collections, updatedCollection) => {
  return collections.map(i => (
    i._id === updatedCollection._id ? updatedCollection : i
  ));
};


const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections(state, action) {
      return action.payload;
    },
    addCollection(state, action) {
      const newCollection = action.payload;
      const updatedCollections = handleUpdateDefaultState(state, newCollection._id);
      return [newCollection, ...updatedCollections];
    },
    updateDefaultState(state, action) {
      const updatedCollection = action.payload;
      const updatedCollections = handleUpdateDefaultState(state, updatedCollection);
      return updatedCollections;
    },
    updateCollectionState(state, action) {
      const updatedCollection = action.payload;
      const allCollections = handleUpdateCollection(state, updatedCollection._id);
      return allCollections;
    },
    deleteCollection(state, action) {
      const collectionIdToDelete = action.payload;
      return state.filter(i => i._id !== collectionIdToDelete);
    },
  },
});

export const { setCollections, addCollection, deleteCollection, updateDefaultState, updateCollectionState } = collectionsSlice.actions;
export default collectionsSlice.reducer;
