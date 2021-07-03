import { db } from "../../database";
import {

  GET_ORDER,
  GET_ORDERS,

  CLEAR_CURRENT_ORDER,
  CHANGE_STATUS,
  ORDERS_COUNT,
  SEARCH_ORDERS,
  ORDERS_LOADING,
  SET_CURRENT_ORDER,
  UPDATE_ORDER
} from "../types";



export const getOrders = (restaurantId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDERS_LOADING });

    const { userData: { user } } = getState()

    const listener = await db
      .collection("orders")
      .where("restaurantId", "==", restaurantId || user?.store)
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
        dispatch({ type: ORDERS_COUNT });

        calculateOrderCounts();
      }, (e) => {
        console.log(e)
      });

    return listener;
  } catch (error) {
    console.log(error.message);
    dispatch({ type: GET_ORDERS, payload: [] });
  }
};

export const setCurrentOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDERS_LOADING });
    await db
      .collection("orders")
      .doc(id)
      .onSnapshot((order) => {
        if (order.exists) {
          dispatch({
            type: SET_CURRENT_ORDER,
            payload: { id: order.id, ...order.data() },
          })
        }
      }

      );
  } catch (error) {
    console.log(error.message);
  }
};

export const filterOrders = (params) => (dispatch) => {
  dispatch({ type: SEARCH_ORDERS, payload: params });
};

export const clearCurrentOrder = () => (dispatch) =>
  dispatch({ type: CLEAR_CURRENT_ORDER });

export const getOrder = (orderId) => async (dispatch) => {
  dispatch({ type: ORDERS_LOADING });
  const order = await db.collection("orders").doc(orderId).get();
  dispatch({ type: GET_ORDER, payload: { id: order.id, ...order.data() } });
};

export const filterOrderByDates = (start, end) => dispatch => {
  dispatch({ type: ORDERS_LOADING });
  dispatch({ type: 'BY_DATES', payload: { start, end } })
}

export const updateOrder = order => async dispatch => {
  try {
    dispatch({ type: ORDERS_LOADING });
    await db.collection('orders').doc(order.id).update(order)
    dispatch({ type: UPDATE_ORDER })
    return true;
  } catch (error) {
    console.log('@Error at updateOrder', error.message)
  }
}

export const processPaymentAndUpdateOrder = orderId => async dispatch => {
  try {
    const current = await db.collection('orders').doc(orderId).get()
    if (!current.data().isPaid) {
      await db.collection('orders').doc(orderId).update({ isPaid: true, status: 'pickup' })
    }


    dispatch({ type: SET_CURRENT_ORDER, payload: { id: current.id, ...current.data() } })

  } catch (error) {
    console.log('Erro processing payment and edting order', error.message)
  }
}


export const clearOrderFilter = () => dispatch => dispatch({ type: "SET_CLEAR" });

export const changeStatus = (id, status, user = null, reason = null) => async (dispatch) => {
  try {
    dispatch({ type: ORDERS_LOADING });
    await db
      .collection("orders")
      .doc(id)
      .update({
        status,
        deliveredOn: status === "delivered" ? new Date().toISOString() : null,
        pickedOn: status === "pickup" ? new Date().toISOString() : null,
        processingOn: status === 'in progress' ? new Date().toISOString() : null,
        cancelReason: status === 'canceled' ? reason : null,
        markedAsDeliveredBy: user,
      });

    dispatch({ type: CHANGE_STATUS, payload: { id, status } });
  } catch (error) {
    console.log(error.message);
  }
};

const calculateOrderCounts = () => (dispatch) => {
  dispatch({ type: ORDERS_COUNT });
};

