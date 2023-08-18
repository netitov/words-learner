import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const updateDefaultState = (collections, newDefaultId) => {
  return collections.map(i => ({
    ...i,
    default: i._id === newDefaultId ? true : false
  }));
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
      const updatedCollections = updateDefaultState(state, newCollection._id);
      return [newCollection, ...updatedCollections];
    },
    updateCollection(state, action) {
      const updatedCollection = action.payload;
      const updatedCollections = updateDefaultState(state, updatedCollection._id);
      return updatedCollections;
    },
    deleteCollection(state, action) {
      const collectionIdToDelete = action.payload;
      return state.filter(i => i._id !== collectionIdToDelete);
    },
  },
});

export const { setCollections, addCollection, deleteCollection, updateCollection } = collectionsSlice.actions;
export default collectionsSlice.reducer;
