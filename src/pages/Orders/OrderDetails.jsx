import { Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import moment from 'moment'
import { setCurrentOrder, clearCurrent } from '../../reduxStore/actions/ordersActions'

import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import OrderItem from '../../components/Order/OrderItem'

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const OrderDetails = () => {

    const { id } = useParams()
    const { current, loading } = useSelector(state => state.ordersData)
    const dispatch = useDispatch()
    const history = useHistory()

    const isDelivery = () => current?.orderType === 'delivery'

    useEffect(() => {
        dispatch(setCurrentOrder(id))

        return () => {
            clearCurrent()
        }
    }, [id, dispatch])

    if (!current || loading) return <Loader />
    return (
        <div className='order_details_container'>
            <div onClick={() => history.goBack()} style={{ alignItems: 'center', top: 30, left: 40, justifyContent: 'center', display: 'flex', float: 'left', position: 'absolute', marginBottom: '1rem' }} className="back">
                <ArrowBackIcon />  Back
            </div>
            <div className="top">
                <div className="order_number">

                    <Typography variant='subtitle1'>{current.customer.name} {current.customer.lastName}</Typography>
                    {current.orderType === 'delivery' ? <LocalShippingIcon /> : <DirectionsWalkIcon />}
                    <Typography>Order # {current.orderNumber}</Typography>
                </div>

                <div className="top_details">
                    <div className="customer">
                        <Typography variant='subtitle1'>Order Date: {moment(current.orderPlaced).calendar()}</Typography>
                        <Typography variant='subtitle1'>Order Type: {isDelivery() ? 'Delivery' : 'Pick Up'}</Typography>
                        {isDelivery() ? (
                            <Typography>Address: {current.customer.address.street} {current.customer.address.apt && current.customer.address.apt}, {current.customer.address.city} {current.customer.address.zipcode}</Typography>
                        ) : (<Typography></Typography>)}
                    </div>
                    <div className="actions">
                        <Typography>Current Status: {current.status}</Typography>
                    </div>

                </div>
                <div className="bottom_details">
                    {current.items.map(item => <OrderItem key={item.id} item={item} />)}
                </div>
            </div>

        </div>
    )
}

export default OrderDetails
