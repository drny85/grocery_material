import { Button, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import { processPaymentAndUpdateOrder } from '../../reduxStore/actions/ordersActions'
import sendNotification from '../../utils/sendNotification'

const PaymentSuccess = () => {

    const { orderId } = useParams()
    const history = useHistory()
    const { current } = useSelector(state => state.ordersData)
    const dispatch = useDispatch()
    useEffect(() => {

        const makePayment = async () => {
            const result = await dispatch(processPaymentAndUpdateOrder(orderId))
            if (result) {
                sendNotification(
                    `Congratulations ${current.customer.name}!`,
                    "Your order has been picked up, enjoy!",
                    current
                );
            }
        }

        makePayment()
        return () => {

        }
        //eslint-disable-next-line
    }, [dispatch, orderId])

    if (!current) return <Loader />
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eee', flexDirection: 'column', maxWidth: '1280px' }}>
            <Typography>Payment for order #{current.orderNumber} was processed Sucessfuly</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: '2rem', width: '40%' }}>
                <Button onClick={() => history.replace(`/orders/${current.id}`)} variant='outlined' color='primary'>View Order Detail</Button>
                <Button onClick={() => history.replace('/orders')} variant='outlined' color='secondary'>View All Orders</Button>
            </div>
        </div>
    )
}

export default PaymentSuccess
