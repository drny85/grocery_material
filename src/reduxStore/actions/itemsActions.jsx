import { db } from "../../database";
import {
  ADD_ITEM,

  CLEAR_CURRENT_ITEM,
  CLEAR_ITEMS_FILTERS,
  FILTER_BY_CATEGORY,

  GET_ITEMS,
  ITEMS_LOADING,
  ITEM_ERROR,
  LOADING_CURRENT_ITEM,
  SET_CURRENT_ITEM,
} from "../types";

export const getItems = (userId) => async (dispatch, getState) => {
  try {
    const { store } = await (
      await db.collection("users").doc(userId).get()
    ).data();
    dispatch({ type: ITEMS_LOADING });
    db.collection("items")
      .doc(store)
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
    console.log("Error getting items", error.message);
    dispatch({ type: ITEM_ERROR, payload: error.message })
  }
};

export const addItem = item => async (dispatch, getState) => {

  try {
    dispatch({ type: ITEMS_LOADING })
    const { userData: { store } } = getState()

    item.storeId = store?.id;

    await db.collection('items').doc(store?.id).collection('items').add(item)
    const itemData = await db
      .collection("items")
      .doc(store.id)
      .collection("items")
      .get();

    const allItems = itemData.docs.map((item) => {
      return { id: item.id, ...item.data() };
    });

    const data = await db.collection("stores").doc(store?.id).get();

    if (data.exists) {
      if (!data.data().hasItems) {
        data.ref.update({
          hasItems: true,
        });
      }
    }

    dispatch({ type: ADD_ITEM, payload: allItems });

    return true;
  } catch (error) {
    console.log('Error adding item', error.message)
    dispatch({ type: ITEM_ERROR, payload: error.message })
    return false
  }



}

export const deleteItem = (id, storeId) => async dispatch => {
  try {
    console.log(id, storeId)
    await db.collection('items').doc(storeId).collection('items').doc(id).delete();
    return true
  } catch (error) {
    console.log("Error deleting item", error.message)
    dispatch({ type: ITEM_ERROR, payload: error.message })
    return false
  }
}

export const setCurrentItem = (itemId, storeId) => async (dispatch, getState) => {
  try {
    dispatch({ type: LOADING_CURRENT_ITEM });
    const { userData: { store } } = getState()

    const sub = await db.collection('items').doc(storeId || store?.id).collection('items').doc(itemId);
    const listener = await sub.onSnapshot(i => {
      if (i.exists) {
        dispatch({ type: SET_CURRENT_ITEM, payload: { id: i.id, ...i.data() } })
      }
    })

    return listener

  } catch (error) {
    console.log('error setting current item', error.message)
    dispatch({ type: ITEM_ERROR, payload: error.message })
  }

}

export const updateItem = item => async dispatch => {
  try {

    await db.collection('items').doc(item.storeId).collection('items').doc(item.id).update(item)


    return true

  } catch (error) {
    console.log('Error updating item', error.message)
    return false
  }

}

export const changeAvailability = (id, value, storeId) => async dispatch => {
  try {

    await db
      .collection("items")
      .doc(storeId)
      .collection("items")
      .doc(id)
      .update({
        available: value,
      });
    const i = await db.collection('items').doc(storeId).collection('items').doc(id).get();
    return i.data().available

  } catch (error) {
    console.log(error.message);
  }
};

export const clearCurrentItem = () => dispatch => {
  dispatch({ type: CLEAR_CURRENT_ITEM })
}

export const filterCategoriesBy = (categoryId) => (dispatch) => {

  dispatch({ type: FILTER_BY_CATEGORY, payload: categoryId });
};

export const clearItemsFilters = () => (dispatch) => {
  dispatch({ type: CLEAR_ITEMS_FILTERS });
};
