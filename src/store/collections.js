import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections(state, action) {
      return action.payload;
    },
    addCollection(state, action) {
      return [action.payload, ...state];
    },
    deleteCollection(state, action) {
      const collectionIdToDelete = action.payload;
      return state.filter(i => i._id !== collectionIdToDelete);
    },
  },
});

export const { setCollections, addCollection, deleteCollection } = collectionsSlice.actions;
export default collectionsSlice.reducer;
