import { ADD_COUPON, COUPONS_LOADING, GET_COUPONS } from "../types";


const initialState = {
    coupons: [],
    coupon: null,
    loading: false,
    error: null
}

const couponsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ADD_COUPON:

            return {
                ...state,
                coupons: [payload, ...state.coupons],
            }
        case GET_COUPONS:
            return {
                ...state,
                coupons: payload,
                error: null,
                loading: false,
            }
        case COUPONS_LOADING:
            return {
                ...state,
                loading: true,
                error: false,
            }

        default:
            return state;
    }
}

export default couponsReducer