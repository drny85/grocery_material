import { db } from "../../database";
import { CATEGORY_ERROR, CATEGORY_LOADING, CLEAR_CATEGORY_ERROR, GET_CATEGORIES } from "../types";

export const getCategories = (userId = null) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_LOADING })
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

export const addNewCategory = category => async (dispatch, getState) => {
  try {
    const name = category.toLowerCase()

    const { userData: { store } } = getState()
    const data = { name: category, storeId: store.id }
    const found = (await db.collection('categories').doc(store.id).collection('categories').where('name', '==', name).get()).size
    if (found > 0) {
      dispatch({ type: CATEGORY_ERROR, payload: `${name} already exist!` })
      return;
    }
    await db.collection('categories').doc(store.id).collection('categories').add(data)

    return true


  } catch (error) {
    console.log("error adding category", error.message)
    dispatch({ type: CATEGORY_ERROR, payload: error.message })
    return false
  }
}

export const updateCategory = category => async (dispatch, getState) => {
  try {
    const name = category.name.toLowerCase()
    const found = (await db.collection('categories').doc(category.storeId).collection('categories').where('name', '==', name).get()).size

    if (found > 0) {
      dispatch({ type: CATEGORY_ERROR, payload: `${category.name} already exist!` })
      return false
    }

    await db.collection('categories').doc(category.storeId).collection('categories').doc(category.id).update({ name: category.name })

    return true
  } catch (error) {
    console.log('error updating category', error.message)
    dispatch({ type: CATEGORY_ERROR, payload: error.message })
    return false
  }

}

export const deleteCategory = category => async dispatch => {
  try {
    await db.collection('categories').doc(category.storeId).collection('categories').doc(category.id).delete();

    return true
  } catch (error) {
    console.log('error deleteing category', error.message)
    return false
  }
}

export const clearCategoriesError = () => dispatch => {
  dispatch({ type: CLEAR_CATEGORY_ERROR })
}
