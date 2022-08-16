import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  properties: [],
  filteredProperties: [],
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    STORE_PROPERTIES: (state, action) => {
      state.properties = action.payload.properties;
    },
    FILTER_BY_LOCATION: (state, action) => {
      const { properties, location } = action.payload;
      let tempProperties = [];
      if (location === "All") {
        tempProperties = properties;
      } else {
        tempProperties = properties.filter(
          (property) => property.location === location
        );
      }
      state.filteredProperties = tempProperties;
    },
    FILTER_BY_SEARCH: (state, action) => {
      const { properties, search } = action.payload;

      let tempProperties = properties.filter((property) =>
        property.location.toLowerCase().includes(search.toLowerCase())
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
  STORE_PROPERTIES,
  FILTER_BY_LOCATION,
  FILTER_BY_SEARCH,
  SORT_PROPERTIES,
} = propertySlice.actions;

export const selectProperties = (state) => state.property.properties;
export const selectFilteredProperties = (state) =>
  state.property.filteredProperties;

export default propertySlice.reducer;
