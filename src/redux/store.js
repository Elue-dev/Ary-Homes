import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authRedcer from '../redux/slice/authSlice'
import propertyReducer from '../redux/slice/propertySlice'

const rootReducer = combineReducers({
  auth: authRedcer,
  property: propertyReducer

})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  export default store;