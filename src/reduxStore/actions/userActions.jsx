import { auth, db } from "../../database";
import * as actions from "../types";

export const signin = ({ email, password }) => async (dispatch) => {
  try {
    dispatch({ type: actions.USER_LOADING });
    const response = await auth.signInWithEmailAndPassword(email, password);
    const user = await db.collection("users").doc(response.user.uid).get();

    if (user.id) {
      dispatch({
        type: actions.USER_LOGIN,
        payload: { id: user.id, ...user.data() },
      });
    } else {
      dispatch({
        type: actions.USER_ERROR,
        payload: "invalid email or password",
      });
    }
  } catch (error) {
    console.log("ERROR LOGING IN", error);
    dispatch({ type: actions.USER_ERROR, payload: error.message });
  }
};

export const setLogin = (user) => async (dispatch) => {
  try {
    dispatch({ type: actions.USER_LOADING });
    const n = await db.collection("users").doc(user.uid).get();

    const u = n.data();

    if (u) {
      dispatch({
        type: actions.USER_LOGIN,
        payload: u,
      });
    }

    //userStore(u?.store);
  } catch (error) {
    console.log("logging in", error.message);
    dispatch({ type: actions.USER_ERROR, payload: error.message })
  }
};

export const userStore = (userId) => async (dispatch) => {
  try {

    if (userId) {
      const user = await db.collection("users").doc(userId).get();
      if (user.data().store) {
        await db
          .collection("stores")
          .doc(user.data().store)
          .onSnapshot((doc) => {
            if (doc.exists) {
              dispatch({
                type: actions.SET_STORE,
                payload: { id: doc.id, ...doc.data() },
              });
            }
          });
      } else {
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const closeOpenStore = () => async (dispatch, getState) => {
  const {
    userData: { store },
  } = getState();

  await db.collection("stores").doc(store.id).update({ open: !store.open });
};

export const autoLogin = () => dispatch => {
  try {
    dispatch({ type: actions.USER_LOADING });
    auth.onAuthStateChanged((u) => {
      if (u) {
        setLogin(u);
      }
    });
  } catch (error) {
    console.log('Error autoling user', error.message)
  }

};

export const logout = () => async (dispatch) => {
  dispatch({ type: actions.USER_LOADING });
  await auth.signOut();
  dispatch({ type: actions.USER_LOGOUT });
};

