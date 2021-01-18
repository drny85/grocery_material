import {

    GET_ORDER,
    GET_ORDERS,
    SET_CURRENT_ITEM,
    CLEAR_CURRENT_ITEM,
    CHANGE_STATUS,
    ORDERS_COUNT,
    SEARCH_ORDERS,
    ORDERS_LOADING,
} from "../types";

import moment from 'moment'

const initialState = {
    orders: [],
    current: null,
    filtered: [],
    loading: false,
    delivered: 0,
    in_progress: 0,
    _new: 0,
};


const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case ORDERS_LOADING:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case ORDERS_COUNT:
            return {
                ...state,
                loading: false,
                error: null,
                delivered: state.orders.filter((order) => order.status === "delivered")
                    .length,
                in_progress: state.orders.filter(
                    (order) => order.status === "in progress"
                ).length,
                new: state.orders.filter((order) => order.status === "new").length,
            };

        case CHANGE_STATUS:
            return {
                ...state,
                orders: state.orders.filter((order) => {
                    if (order.id === action.payload.id) {
                        return (order.status = action.payload.status);
                    }
                    return order;
                }),
                loading: false,
                error: null,
            };
        case SET_CURRENT_ITEM:
            return {
                ...state,
                current: action.payload,
                loading: false,
                error: null,
            };

        case CLEAR_CURRENT_ITEM:
            return {
                ...state,
                loading: false,
                current: null,
                error: null,
            };

        case GET_ORDER:
            return {
                ...state,
                current: action.payload,
                loading: false,
                error: false,
            };
        case GET_ORDERS:
            return {
                ...state,
                orders: [...action.payload],
                loading: false,
                error: false,
            };

        case "SET":
            return {
                ...state,
                loading: false,
                filtered: [...state.orders],
            };

        case 'BY_DATES':

            const start = moment(action.payload.start).startOf("day");
            const end = moment(action.payload.end).endOf("day");
            return {
                ...state,
                filtered: state.orders.filter(
                    (order) =>
                        moment(order.orderPlaced).isAfter(start) &&
                        moment(order.orderPlaced).isBefore(end)
                ),
                loading: false,

            }

        case "SET_CLEAR":
            return {
                ...state,
                filtered: [],
                loading: false,
            };
        case SEARCH_ORDERS:
            return {
                ...state,
                filtered: state.orders.filter((order) => {
                    const regex = new RegExp(`${action.payload}`, "gi");
                    return order.customer.name.match(regex) ||
                        order.customer.lastName.match(regex) ||
                        order.customer.phone.match(regex) ||

                        order.orderNumber.toString().match(regex)


                }),
                loading: false,
            };

        default:
            return state;
    }
};

export default ordersReducer;
