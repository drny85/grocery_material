import { db } from "../../database";
import { GET_ITEMS, ITEMS_LOADING } from "../types";

export const getItems = (userId) => async (dispatch, getState) => {
  try {
    const { store } = await (await db.collection('users').doc(userId).get()).data()

    dispatch({ type: ITEMS_LOADING });
    db
      .collection("items")
      .doc(store)
      .collection("items")
      .onSnapshot((doc) => {
        const items = [];
        doc.forEach((item) => {
          if (item.exists) {
            items.push({ id: item.id, ...item.data() });
          }

        });
        console.log(items.length)
        dispatch({ type: GET_ITEMS, payload: items });
      });

  } catch (error) {
    console.log("Error getting items", error);
  }
};
