import { GET_ITEMS, ITEMS_LOADING } from "../types";
const initialState = {
  items: [],
  filtered: [],
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

    case ITEMS_LOADING:
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
