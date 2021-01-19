import { db } from "../../database";
import { GET_CATEGORIES } from "../types";

export const getCategories = (userId = null) => async (dispatch, getState) => {
  try {
    const { store } = await (
      await db.collection("users").doc(userId).get()
    ).data();

    const response = await db
      .collection("categories")
      .doc(store)
      .collection("categories");
    const snapshot = await response.onSnapshot((docs) => {
      const categories = [];
      docs.forEach((doc) => {
        if (doc.exists) {
          categories.push({ id: doc.id, ...doc.data() });
        }
      });

      dispatch({ type: GET_CATEGORIES, payload: categories });
    });

    return snapshot;
  } catch (error) {
    console.log("Error getting caterories", error.message);
  }
};
