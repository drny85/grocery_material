import { db } from "../../database";
import { GET_ITEMS, SET_LOADING } from "../types";

export const getItems = () => async (dispatch, getState) => {
  try {
    const {
      userData: { store },
    } = getState();
    dispatch({ type: SET_LOADING });
    await db
      .collection("items")
      .doc(store.id)
      .collection("items")
      .onSnapshot((doc) => {
        const items = [];
        doc.forEach((item) => {
          if (item.exists) {
            items.push({ id: item.id, ...item.data() });
          }
        });

        dispatch({ type: GET_ITEMS, payload: items });
      });
  } catch (error) {
    console.log("Error getting items", error);
  }
};
