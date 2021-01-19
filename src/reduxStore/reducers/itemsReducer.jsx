import {
  CLEAR_ITEMS_FILTERS,
  FILTER_BY_CATEGORY,
  GET_ITEMS,
  ITEMS_LOADING,
} from "../types";
const initialState = {
  items: [],
  filtered: null,
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

    case FILTER_BY_CATEGORY:

      return {
        ...state,
        filtered: [
          ...state.items.filter(
            (category) => category.category === action.payload
          ),
        ],
        loading: false,
      };
    case CLEAR_ITEMS_FILTERS:
      return {
        ...state,
        filtered: null,
        loading: false,
      };

    default:
      return state;
  }
};

export default itemsReducer;
