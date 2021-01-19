import { Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BackArrow from '../../../components/BackArrow'
import Loader from '../../../components/Loader'
import { clearCurrentItem, setCurrentItem } from '../../../reduxStore/actions/itemsActions'

import './styles.css'

const ItemDetails = () => {
    const { current, loading } = useSelector(state => state.itemsData)
    const { store } = useSelector(state => state.userData)
    const dispatch = useDispatch()
    const { id } = useParams()

    useEffect(() => {
        dispatch(setCurrentItem(id, store?.id))
        return () => {
            dispatch(clearCurrentItem())
        }
    }, [dispatch, id, store?.id])



    if (loading) return <Loader />
    return (
        <div className="main">
            <div style={{ maxWidth: '1080px', margin: '1rem auto' }}>
                <BackArrow />
                <Typography variant='h4' align='center'>Item Details</Typography>
            </div>

            <div className='item-detail-div'>
                <div style={{ backgroundImage: `url(${current?.imageUrl})` }} className="image-div">

                </div>
                <div className="desc-div">
                    <Typography className='capitalize' align='center' variant='h5'>{current?.name}</Typography>
                    <Typography>{current?.description}</Typography>
                    <Typography>${current?.price}</Typography>
                </div>

            </div>
        </div>

    )
}

export default ItemDetails
