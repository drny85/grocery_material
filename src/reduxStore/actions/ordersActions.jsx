import { db } from "../../database";
import {
    SET_LOADING,
    GET_ORDER,
    GET_ORDERS,
    SET_CURRENT_ITEM,
    CLEAR_CURRENT_ITEM,
    CHANGE_STATUS,
    ORDERS_COUNT,
    SEARCH_ORDERS,
} from "../types";

export const getOrders = (restaurantId) => async dispatch => {

    try {

        setLoading();

        const listener = await db.collection('orders')
            .where('restaurantId', '==', restaurantId)
            .orderBy("orderPlaced", "desc")
            .onSnapshot((values) => {
                let orders = [];
                values.forEach((doc) => {
                    let order = {
                        id: doc.id,
                        ...doc.data(),
                    };
                    orders.push(order);
                });

                dispatch({ type: GET_ORDERS, payload: orders });
                calculateOrderCounts();
            });

        return listener;


    } catch (error) {
        console.log(error)
        dispatch({ type: GET_ORDERS, payload: [] });
    }


};

export const setCurrentOrder = (id) => async dispatch => {
    try {
        dispatch({ type: SET_LOADING })
        await db.collection('orders').doc(id).onSnapshot((order) =>
            dispatch({
                type: SET_CURRENT_ITEM,
                payload: { id: order.id, ...order.data() },
            })
        );
    } catch (error) {
        console.log(error);
    }
};

export const clearCurrent = () => dispatch => dispatch({ type: CLEAR_CURRENT_ITEM });

export const getOrder = (orderId) => async dispatch => {
    dispatch({ type: SET_LOADING })
    const order = await db.collection('orders').doc(orderId).get();
    dispatch({ type: GET_ORDER, payload: { id: order.id, ...order.data() } });
};

const calculateOrderCounts = () => dispatch => {
    dispatch({ type: ORDERS_COUNT });
};


const setLoading = () => dispatch => dispatch({ type: SET_LOADING });