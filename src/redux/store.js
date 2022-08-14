import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authRedcer from "../redux/slice/authSlice";
import propertyReducer from "../redux/slice/propertySlice";
import blogReducer from "../redux/slice/blogSlice";
import filterReducer from "../redux/slice/filterSlice";

const rootReducer = combineReducers({
  auth: authRedcer,
  property: propertyReducer,
  blog: blogReducer,
  filter: filterReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
