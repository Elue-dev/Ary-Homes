import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredBlogs: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_BY_CATEGORY: (state, action) => {
      const { blogPosts, category } = action.payload;
      console.log(action.payload)
      let tempBlogs = [];
      if (category === "All") {
        tempBlogs = blogPosts;
      } else {
        tempBlogs = blogPosts.filter((post) => post.category === category);
      }
      state.filteredBlogs = tempBlogs;
    },
  },
});

export const { FILTER_BY_CATEGORY } = filterSlice.actions;

export const selectFilteredBlogs = (state) => state.filter.filteredBlogs;

export default filterSlice.reducer;
