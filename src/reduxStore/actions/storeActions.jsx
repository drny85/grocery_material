import { db } from "../../database"
import { GET_STORES, STORE_ERROR, STORE_SUCCESS, SUBMITTING_APPLICATION } from "../types"


export const newStoreApplication = (storeInfo) => async dispatch => {
    try {
        dispatch({ type: SUBMITTING_APPLICATION })
        console.log(storeInfo)
        const stores = await db.collection('stores').get()
        await stores.forEach(async s => {
            if (s.exists) {
                const storeData = s.data()
                if (storeData.name === storeInfo.name || storeData.phone === storeInfo.phone || storeData.street === storeInfo.street) {
                    dispatch({ type: STORE_ERROR, payload: 'an application already has been submitted. Check the status' })
                    console.log('H')
                    return false
                }


            } else {
                console.log('THERE')
                await db.collection('stores').add(storeInfo);
                dispatch({ type: STORE_SUCCESS })
                return true
            }

        })





    } catch (error) {
        console.log(error.message)
        dispatch({ type: STORE_ERROR, payload: error.message })
        return false
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