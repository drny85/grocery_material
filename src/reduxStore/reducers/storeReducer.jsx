import { GET_STORES, SETTING_CURRENT_STORE, STORE_ERROR, STORE_LOADING, STORE_SUCCESS, SUBMITTING_APPLICATION } from "../types";

const initialState = {
    stores: [],
    current: null,
    loading: false,
    error: null
}
const storeReducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case STORE_ERROR:
            return {
                ...state,
                loading: false,
                error: payload
            }

        case STORE_LOADING:
        case SUBMITTING_APPLICATION:
            return {
                ...state,
                loading: true,
                error: null
            }
        case STORE_SUCCESS:
            return {
                ...state,
                loading: false,
            }

        case SETTING_CURRENT_STORE:
            return {
                ...state,
                current: payload,
                loading: false
            }
        case 'CLEAR_STORE_ERROR':
            return {
                ...state,
                loading: false,
                error: null
            }

        case GET_STORES:
            return {
                ...state,
                stores: [...payload],
                loading: false
            }

        default:
            return state;

    }

}


export default storeReducer