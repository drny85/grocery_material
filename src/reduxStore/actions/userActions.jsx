import { auth, db } from "../../database"
import * as actions from '../types'

export const signin = ({ email, password }) => async dispatch => {

    try {

        const response = await auth.signInWithEmailAndPassword(email, password);
        const user = await db.collection('users').doc(response.user.uid).get()

        if (user.id) {
            dispatch({ type: actions.USER_LOGIN, payload: { id: user.id, ...user.data() } })
        } else {
            dispatch({ type: actions.USER_ERROR, payload: 'invalid email or password' })

        }

    } catch (error) {
        console.log('ERROR LOGING IN', error)
        dispatch({ type: actions.USER_ERROR, payload: error.message })
    }


}


export const setLogin = (user) => async dispatch => {

    try {
        setLoading();
        const n = await db.collection("users").doc(user.uid).get();

        const u = n.data();

        userStore(u.store)
        if (u) {
            dispatch({
                type: actions.USER_LOGIN,
                payload: u,
            });

        }

    } catch (error) {
        console.log('logging in', error)
    }

};

const userStore = storeId => async dispatch => {
    try {
        if (storeId) {

            setLoading()
            const store = (await db.collection('stores').doc(storeId).get())
            dispatch({ type: actions.SET_STORE, payload: { id: store.id, ...store.data() } })
        }

    } catch (error) {
        console.log(error)
    }

}

export const autoLogin = () => {
    auth.onAuthStateChanged((u) => {
        if (u) {
            setLogin(u);

        }
    });
};

export const clearCurrent = () => dispatch => dispatch({ type: CLEAR_CURRENT_ITEM });


export const logout = () => async dispatch => {
    setLoading();
    await auth.signOut();
    dispatch({ type: actions.USER_LOGOUT });
};

const setLoading = () => dispatch => dispatch({ type: actions.SET_LOADING });