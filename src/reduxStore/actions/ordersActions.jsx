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


export const getOrders = (restaurantId) => async (dispatch, getState) => {
  try {
    dispatch({ type: SET_LOADING })

    const listener = await db
      .collection("orders")
      .where("restaurantId", "==", restaurantId)
      .orderBy("orderPlaced", "desc")
      .onSnapshot((values) => {

        let newOrders = [];
        values.forEach((doc) => {
          let order = {
            id: doc.id,
            ...doc.data(),
          };
          newOrders.push(order);
        });


        dispatch({ type: GET_ORDERS, payload: newOrders });
        calculateOrderCounts();
      }, (e) => {
        console.log(e)
      });

    return listener;
  } catch (error) {
    console.log(error);
    dispatch({ type: GET_ORDERS, payload: [] });
  }
};

export const setCurrentOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    await db
      .collection("orders")
      .doc(id)
      .onSnapshot((order) =>
        dispatch({
          type: SET_CURRENT_ITEM,
          payload: { id: order.id, ...order.data() },
        })
      );
  } catch (error) {
    console.log(error);
  }
};

export const filterOrders = (params) => (dispatch) => {
  dispatch({ type: SEARCH_ORDERS, payload: params });
};

export const clearCurrent = () => (dispatch) =>
  dispatch({ type: CLEAR_CURRENT_ITEM });

export const getOrder = (orderId) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  const order = await db.collection("orders").doc(orderId).get();
  dispatch({ type: GET_ORDER, payload: { id: order.id, ...order.data() } });
};

export const filterOrderByDates = (start, end) => dispatch => {
  dispatch({ type: SET_LOADING });
  dispatch({ type: 'BY_DATES', payload: { start, end } })
}


export const clearOrderFilter = () => dispatch => dispatch({ type: "SET_CLEAR" });

export const changeStatus = (id, status, user = null) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    await db
      .collection("orders")
      .doc(id)
      .update({
        status,
        deliveredOn: status === "delivered" ? new Date().toISOString() : null,
        markedAsDeliveredBy: user,
      });

    dispatch({ type: CHANGE_STATUS, payload: { id, status } });
  } catch (error) {
    console.log(error);
  }
};

const calculateOrderCounts = () => (dispatch) => {
  dispatch({ type: ORDERS_COUNT });
};

const setLoading = () => (dispatch) => dispatch({ type: SET_LOADING });
