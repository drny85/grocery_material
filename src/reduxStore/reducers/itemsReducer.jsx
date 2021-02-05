import {
  ADD_ITEM,
  CLEAR_CURRENT_ITEM,
  CLEAR_ITEMS_FILTERS,
  DELETE_ITEM,
  FILTER_BY_CATEGORY,
  GET_ITEMS,
  ITEMS_LOADING,
  LOADING_CURRENT_ITEM,
  SET_CURRENT_ITEM,
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
        items: [...action.payload],
        loading: false,
      };
    case ADD_ITEM:
      return {
        ...state,
        items: action.payload,
        loading: false
      }

    case ITEMS_LOADING:
    case LOADING_CURRENT_ITEM:
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
    case SET_CURRENT_ITEM:
      return {
        ...state,
        current: action.payload,
        loading: false,
      }

    case CLEAR_CURRENT_ITEM:
      return {
        ...state,
        current: null,
        loading: false,
        error: null,
      }
    case CLEAR_ITEMS_FILTERS:
      return {
        ...state,
        filtered: null,
        loading: false,
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: [...state.items.filter(i => i.id !== action.payload)],
        loading: false
      }

    default:
      return state;
  }
};

export default itemsReducer;
