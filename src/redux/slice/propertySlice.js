import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  properties: [],
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    STORE_PROPERTIES: (state, action) => {
      state.properties = action.payload.properties;
    },
    
  },
});

export const {
  STORE_PROPERTIES,

} = propertySlice.actions;

export const selectProperties = (state) => state.property.properties;

export default propertySlice.reducer;
