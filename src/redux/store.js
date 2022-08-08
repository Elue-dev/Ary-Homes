import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authRedcer from '../redux/slice/authSlice'

const rootReducer = combineReducers({
  auth: authRedcer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  export default store;