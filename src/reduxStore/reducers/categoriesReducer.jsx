import { CATEGORY_ERROR, GET_CATEGORIES, CATEGORY_LOADING } from "../types";

const initialState = {
  categories: [],
  loading: false,
  error: null,
  current: null,
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading: false,
        error: null,
      };

    case CATEGORY_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case CATEGORY_LOADING:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};

export default categoriesReducer;
