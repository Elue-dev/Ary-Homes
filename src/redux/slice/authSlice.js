import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  email: null,
  userID: null,
  userName: null,
  users: [],
  userInfo: [],
  userId: "",
  deletedUsers: [],
  previousURL: ''
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_ACTIVE_USER: (state, action) => {
      const { email, userID, userName } = action.payload;
      state.isLoggedIn = true;
      state.email = email;
      state.userName = userName;
      state.userID = userID;
    },
    REMOVE_ACTIVE_USER: (state) => {
      state.isLoggedIn = false;
      state.email = null;
      state.userName = null;
      state.userID = null;
    },
    STORE_USERS: (state, action) => {
      state.users = action.payload;
    },
    STORE_USER_INFO: (state, action) => {
      state.userInfo = action.payload;
    },
    STORE_USER_ID: (state, action) => {
      state.userId = action.payload;
    },
    DELETED_USERS: (state, action) => {
      state.deletedUsers = action.payload;
    },
    SAVE_URL: (state, action) => {
      state.previousURL = action.payload;
    },
  },
});

export const {
  SET_ACTIVE_USER,
  REMOVE_ACTIVE_USER,
  STORE_USERS,
  STORE_USER_INFO,
  STORE_USER_ID,
  DELETED_USERS,
  SAVE_URL
} = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectEmail = (state) => state.auth.email;
export const selectUserName = (state) => state.auth.userName;
export const selectUserID = (state) => state.auth.userID;
export const selectUsers = (state) => state.auth.users;
export const selectUserInfo = (state) => state.auth.userInfo;
export const selectUserId = (state) => state.auth.userId;
export const selectDeletedUsers = (state) => state.auth.deletedUsers;
export const selectPreviousURL = (state) => state.auth.previousURL;

export default authSlice.reducer;
