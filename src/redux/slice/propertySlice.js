import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  properties: [],
  bookmarks: localStorage.getItem("bookmarks")
    ? JSON.parse(localStorage.getItem("bookmarks"))
    : [],
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    STORE_PROPERTIES: (state, action) => {
      state.properties = action.payload.properties;
    },
    ADD_TO_BOOKMARKS: (state, action) => {
      let tempProperty = { ...action.payload, bookmarked: 1 };
      state.bookmarks.push(tempProperty);
      localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
    },
  },
});

export const { STORE_PROPERTIES, ADD_TO_BOOKMARKS } = propertySlice.actions;

export const selectProperties = (state) => state.property.properties;
export const selectBookmarks = (state) => state.property.bookmarks;

export default propertySlice.reducer;
