import {
  USER_ERROR,
  USER_LOGIN,
  USER_LOGOUT,
  USER_SIGN_UP,
  SET_STORE,
  USER_LOADING,
  CLEAR_USER_ERROR,
} from "../types";

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  store: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGN_UP:
    case USER_LOGIN:
      return {
        ...state,
        user: action.payload,
        error: null,
        loading: false,
        isAuthenticated: true,
      };

    case USER_LOADING:
      return {
        ...state,
        loading: true,
        error: false,
      };

    case USER_LOGOUT:
      return {
        ...state,
        user: null,
        error: null,
        loading: false,
        isAuthenticated: false,
      };

    case SET_STORE:
      return {
        ...state,

        store: action.payload,
        loading: false,
      };
    case CLEAR_USER_ERROR:
      return {
        ...state,
        error: null,
        loading: false
      }

    case USER_ERROR:

      return {
        ...state,
        user: null,

        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default userReducer;
