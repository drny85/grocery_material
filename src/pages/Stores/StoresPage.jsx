import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStores } from '../../reduxStore/actions/storeActions'

const StoresPage = () => {
    const dispatch = useDispatch()
    const { stores } = useSelector(state => state.storesData)

    useEffect(() => {
        dispatch(getStores())
        return () => {

        }
    }, [dispatch])

    console.log(stores)
    return (
        <div>

        </div>
    )
}

export default StoresPage
