import { Grid, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getOrders } from '../../reduxStore/actions/ordersActions'
import OrderCard from './OrderCard'

const Orders = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const { orders } = useSelector(state => state.ordersData)
    const { user } = useSelector(state => state.userData)

    useEffect(() => {
        dispatch(getOrders(user?.store))

        return () => {
            // unsudscribe && unsudscribe()
        }
    }, [dispatch, user])

    return (
        <div>
            <Grid container>
                <Typography variant='h3'>Orders</Typography>

                <Grid item xs={12} sm={4}>
                    {orders.length > 0 && (orders.map(order => <OrderCard onClick={() => history.push(`/orders/${order.id}`)} key={order.id} order={order} />))}

                </Grid>
            </Grid>
        </div>
    )
}

export default Orders
