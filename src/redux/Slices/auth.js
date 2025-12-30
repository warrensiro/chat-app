import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = "";
    },
  },
});

// reducer
export default slice.reducer;

// actions - log in
export function LoginUser(formValues) {
  // formvalues are email and password
  return async (dispatch, getState) => {
    await axiosInstance
      .post(
        "/auth/login",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(
          slice.actions.logIn({ isLoggedIn: true, token: response.data.token })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
}

// actions - sign out
export function LogoutUser() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.signOut());
  };
}

// forgot password action
export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    await axiosInstance
      .post(
        "/auth/forgot-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

// reset password action
export function ResetPassword(formValues) {
  return async (dispatch, getState) => {
    await axiosInstance
      .post(
        "/auth/reset-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.logIn({
          isLoggedIn: true,
          token: response.data.token
        }))
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
