import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    STORE_BLOGS: (state, action) => {
      state.blogs = action.payload.blogs;
    },
  },
});

export const { STORE_BLOGS } = blogSlice.actions;

export const selectBlogs = (state) => state.blog.blogs;

export default blogSlice.reducer;
