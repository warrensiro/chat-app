import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import { showSnackbar } from "./app";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  email: "",
  error: false,
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
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
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
        window.localStorage.setItem("user_id", response.data.user_id);

        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
      });
  };
}

// actions - sign out
export function LogoutUser() {
  return async (dispatch, getState) => {
    window.localStorage.removeItem("user_id");
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
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

// register user action
export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    await axiosInstance
      .post(
        "/auth/register",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.updateRegisterEmail({ email: formValues.email })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      })
      .finally(() => {
        if (!getState().auth.error) {
          window.location.href = "/auth/verify";
        }
      });
  };
}

// verify email thunk action
export function VerifyEmail(formValues) {
  return async (dispatch, getState) => {
    await axiosInstance
      .post(
        "/auth/verify",
        { ...formValues },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
        window.localStorage.setItem("user_id", response.data.user_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
