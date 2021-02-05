import { auth, db } from "../../database"
import { GET_STORES, SETTING_CURRENT_STORE, STORE_ERROR, STORE_LOADING, STORE_SUCCESS, SUBMITTING_APPLICATION } from "../types"


export const newStoreApplication = (storeInfo) => async dispatch => {
    try {
        dispatch({ type: SUBMITTING_APPLICATION })
        const res = await db.collection('stores').where('street', '==', storeInfo.street).where('phone', '==', storeInfo.phone).get();
        const found = res.size > 0;

        if (found) {
            dispatch({ type: STORE_ERROR, payload: 'Application already exists' })
            return
        }

        const store = await db.collection('stores').add(storeInfo)


        dispatch({ type: STORE_SUCCESS })
        return { success: true, id: store.id }



    } catch (error) {
        console.log(error.message)
        dispatch({ type: STORE_ERROR, payload: error.message })
        return false
    }


}

export const updateStoreApplication = storeInfo => async dispatch => {

    try {

        const u = await auth.createUserWithEmailAndPassword(storeInfo.email, storeInfo.password)
        if (u) {
            const { uid, email } = u.user
            storeInfo.userId = uid
            await db.collection('users').doc(uid).set({ email: email, name: storeInfo.owner, isActive: true, isOwner: true, isAdmin: true, store: storeInfo.id, userId: uid })
            await db.collection('stores').doc(storeInfo.id).update(storeInfo)

            const updated = await db.collection('stores').doc(storeInfo.id).get()

            dispatch({ type: SETTING_CURRENT_STORE, payload: { id: updated.id, ...updated.data() } })

            return { success: true, email: email, password: storeInfo.password }

        } else {
            return false
        }


    } catch (error) {
        console.log(error.message)
        dispatch({ type: STORE_ERROR, payload: error.message })
    }

}

export const updateStoreApplicationStatus = (info) => async dispatch => {
    try {

        await db.collection('stores').doc(info.id).update(info)
        return true
    } catch (error) {
        console.log(error.message)
    }
}

export const clearCurrentStore = () => dispatch => dispatch({ type: "CLEAR_CURRENT_STORE" })

export const getStoreDetails = storeId => async dispatch => {

    try {
        dispatch({ type: STORE_LOADING })
        await db.collection('stores').doc(storeId).onSnapshot(doc => {
            if (doc.exists) {
                dispatch({ type: SETTING_CURRENT_STORE, payload: { id: doc.id, ...doc.data() } })
            }
        })


    } catch (error) {
        console.log(error.message)
    }

}

export const clearStoreError = () => dispatch => dispatch({ type: 'CLEAR_STORE_ERROR' })


export const getStores = () => async dispatch => {

    try {
        await db.collection('stores').onSnapshot(docs => {
            const stores = []
            docs.forEach(doc => {
                if (doc.exists) {
                    stores.push({ id: doc.id, ...doc.data() })
                }

            })

            dispatch({ type: GET_STORES, payload: stores })

        })
    } catch (error) {
        console.log(error.message)
        dispatch({ type: STORE_ERROR, payload: error.message })
    }

}