import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredBlogs: [],
  filteredProperties: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_BY_CATEGORY: (state, action) => {
      const { blogPosts, category } = action.payload;
      console.log(action.payload);
      let tempBlogs = [];
      if (category === "All") {
        tempBlogs = blogPosts;
      } else {
        tempBlogs = blogPosts.filter((post) => post.category === category);
      }
      state.filteredBlogs = tempBlogs;
    },
    FILTER_BY_LOCATION: (state, action) => {
      const { properties, location, search } = action.payload;
      let tempProperties = [];
      if (location === "All") {
        tempProperties = properties;
      } else {
        tempProperties = properties.filter(
          (property) =>
            property.location.toLowerCase() === location.toLowerCase()
        );
      }
      state.filteredProperties = tempProperties;
      // const length =  properties.filter(
      //   (property) => property.location === location s
      // ).length;
    },
    FILTER_BY_SEARCH: (state, action) => {
      const { properties, search } = action.payload;

      let tempProperties = properties.filter(
        (property) =>
          property.location.toLowerCase().includes(search.toLowerCase()) ||
          property.name.toLowerCase().includes(search.toLowerCase())
      );
      state.filteredProperties = tempProperties;
    },
    SORT_PROPERTIES: (state, action) => {
      const { properties, sort } = action.payload;

      let tempProperties = [];
      if (sort === "latest") {
        tempProperties = properties;
      }
      if (sort === "lowest-price") {
        tempProperties = properties.slice().sort((a, b) => {
          return a.price - b.price;
        });
      }
      if (sort === "highest-price") {
        tempProperties = properties.slice().sort((a, b) => {
          return b.price - a.price;
        });
      }
      if (sort === "Available") {
        tempProperties = properties.filter(
          (property) => property.availability === "Available"
        );
      }
      if (sort === "Not Available") {
        tempProperties = properties.filter(
          (property) => property.availability === "Not Available"
        );
      }

      state.filteredProperties = tempProperties;
    },
  },
});

export const {
  FILTER_BY_CATEGORY,
  FILTER_BY_LOCATION,
  FILTER_BY_SEARCH,
  SORT_PROPERTIES,
} = filterSlice.actions;

export const selectFilteredBlogs = (state) => state.filter.filteredBlogs;
export const selectFilteredProperties = (state) =>
  state.filter.filteredProperties;

export default filterSlice.reducer;
