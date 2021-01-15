import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import moment from 'moment'
import { setCurrentOrder, clearCurrent } from '../../reduxStore/actions/ordersActions'

import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import OrderItem from '../../components/Order/OrderItem'
import BackArrow from '../../components/BackArrow'
import Controls from '../../components/controls/Controls'

import { phoneFormatted } from '../../utils/phoneFormatted'

const options = [
    {
        id: 'new', name: 'new'
    },
    {
        id: 'in progress', name: 'in progress'
    }
    , {
        id: 'delivered', name: 'delivered'
    }
]



const OrderDetails = () => {

    const { id } = useParams()
    const { current, loading } = useSelector(state => state.ordersData)
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)

    const isDelivery = () => current?.orderType === 'delivery'


    const changeStatus = () => {
        console.log('Chaging')
        setShow(false)
    }
    console.log(show)
    useEffect(() => {
        dispatch(setCurrentOrder(id))

        return () => {
            clearCurrent()
            setShow(false)
        }
    }, [id, dispatch])

    if (!current || loading) return <Loader />
    return (
        <div className='order_details_container'>
            <Typography variant='h5'>Order Details</Typography>

            <div className="top">
                <BackArrow />
                <div className="order_number">

                    <Typography variant='h6'>{current.customer.name} {current.customer.lastName}</Typography>
                    {current.orderType === 'delivery' ? <LocalShippingIcon /> : <DirectionsWalkIcon />}
                    <Typography>Order # {current.orderNumber}</Typography>
                </div>

                <div className="top_details">
                    <div className="customer">
                        <Typography variant='body2'>Order Date: {moment(current.orderPlaced).calendar()}</Typography>
                        <Typography variant='body2'>Customer Phone: {phoneFormatted(current.customer.phone)}</Typography>
                        <Typography variant='body2'>Customer Email: {current.customer.email}</Typography>
                        <Typography variant='body2'>Order Type: {isDelivery() ? 'Delivery' : 'Pick Up'}</Typography>
                        {isDelivery() ? (
                            <Typography>Address: {current.customer.address.street} {current.customer.address.apt && current.customer.address.apt}, {current.customer.address.city} {current.customer.address.zipcode}</Typography>
                        ) : (<Typography></Typography>)}
                        <Typography variant='body2' style={{ textTransform: 'capitalize' }}>Payment Type: {current.paymentMethod}</Typography>
                        <Typography variant='body2'>Delivery Instuctions: {current.instruction}</Typography>
                    </div>
                    <div className="actions">
                        <Typography style={{ textTransform: 'capitalize', padding: '0.5rem' }}>Current Status: {current.status}</Typography>
                        <Controls.Button text='Change Status' onClick={() => setShow(true)} />
                        <Dialog open={show}>
                            <DialogTitle></DialogTitle>
                            <DialogContent>

                            </DialogContent>
                            <DialogActions>
                                <Controls.Button color='lighgray' text='Cancel' onClick={() => setShow(false)} />
                                <Controls.Button text='Change' onClick={changeStatus} />
                            </DialogActions>
                        </Dialog>
                    </div>

                </div>
                <div className="bottom_details">
                    {current.items.map(item => <OrderItem key={item.size ? item.id + item.size : item.id} item={item} />)}
                </div>
                <div className="totalPrice">
                    <Typography variant='h6'>Grand Total</Typography>
                    <Typography variant='h6'>${current.totalAmount.toFixed(2)}</Typography>
                </div>
            </div>

        </div>
    )
}

export default OrderDetails