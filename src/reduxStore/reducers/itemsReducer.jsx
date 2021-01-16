import { GET_ITEMS, SET_LOADING } from "../types";
const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload,
        loading: false,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    default:
      return state;
  }
};

export default itemsReducer;
