import { db } from "../../database"
import { GET_STORES, SETTING_CURRENT_STORE, STORE_ERROR, STORE_LOADING, STORE_SUCCESS, SUBMITTING_APPLICATION } from "../types"


export const newStoreApplication = (storeInfo) => async dispatch => {
    try {
        dispatch({ type: SUBMITTING_APPLICATION })
        const res = await db.collection('stores').where('street', '==', storeInfo.street).where('phone', '==', storeInfo.phone).get();
        const found = res.size > 0;
        console.log(res.size)
        if (found) {
            dispatch({ type: STORE_ERROR, payload: 'Application already exists' })
            return
        }

        await db.collection('stores').add(storeInfo)

        dispatch({ type: STORE_SUCCESS })
        return true



    } catch (error) {
        console.log(error.message)
        dispatch({ type: STORE_ERROR, payload: error.message })
        return false
    }


}

export const updateStoreApplication = storeInfo => async dispatch => {

    try {
        await db.collection('stores').doc(storeInfo.id).update(storeInfo)
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