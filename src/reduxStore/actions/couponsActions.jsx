import { db } from "../../database"
import { ADD_COUPON, COUPONS_LOADING, GET_COUPONS } from "../types"

export const addCoupon = (values) => async (dispatch, getState) => {
    const { userData: { store } } = getState()
    try {
        const couponRes = await db.collection('stores').doc(store.id).collection('coupons').add({ storeId: store.id, addedOn: new Date().toISOString(), ...values })
        const coupon = await db.collection('stores').doc(store.id).collection('coupons').doc(couponRes.id).get()

        dispatch({ type: ADD_COUPON, payload: { id: coupon.id, ...coupon.data() } })
        return { sucess: true }
    } catch (error) {
        console.log("error adding coupon", error)
        return { sucess: false }
    }
}

export const getCoupons = () => async (dispatch, getState) => {
    const { userData: { store } } = getState()
    try {

        const found = (await db.collection('stores').doc(store?.id).collection('coupons').get()).size
        if (found === 0) { }
        dispatch({ type: COUPONS_LOADING })
        const coupons = (await db.collection('stores').doc(store.id).collection('coupons').get()).docs.map((doc) => {
            return {
                id: doc.id, ...doc.data()
            }
        })

        dispatch({ type: GET_COUPONS, payload: coupons })


    } catch (error) {
        console.log('ErrorGetting coupons', error.message)
    }
}

export const updateCoupon = coupon => async (dispatch, getState) => {
    const { userData: { store } } = getState()
    try {
        await db.collection('stores').doc(store?.id).collection('coupons').doc(coupon.id).update(coupon)
    } catch (error) {
        console.log("error updating coupon", error)
    }
}