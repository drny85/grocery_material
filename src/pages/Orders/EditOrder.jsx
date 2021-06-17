import { Button, Dialog, Grid, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import BackArrow from '../../components/BackArrow'
import Loader from '../../components/Loader'
import OrderItem from '../../components/Order/OrderItem'
import { getOrder, updateOrder } from '../../reduxStore/actions/ordersActions'
import sendNotification from '../../utils/sendNotification'


export default function EditOrder() {

    const { id } = useParams()
    const history = useHistory()
    const dispatch = useDispatch()
    const { current, loading } = useSelector(state => state.ordersData)
    const [order, setOrder] = useState(null)
    const [processing, setProcessing] = useState(false)



    const handleAddItem = async (item) => {
        const newOrder = { ...order }
        const newItem = { ...item }
        if (item.quantity >= 1) {
            const index = newOrder.items.findIndex(
                (i) => i.id === item.id && i.size === item.size
            );
            const updatedItems = [...newOrder.items];
            updatedItems[index].quantity = newItem.quantity + 1;

            newOrder.items = updatedItems;
            newOrder.totalAmount = +(newOrder.totalAmount + newItem.price).toFixed(2)

            setOrder({ ...newOrder })

        }
    }

    const handleRemoveItem = async (item) => {
        const newOrder = { ...order }
        const newItem = { ...item }
        if (item.quantity > 1) {
            const index = newOrder.items.findIndex(
                (i) => i.id === item.id && i.size === item.size
            );
            const updatedItems = [...newOrder.items];
            updatedItems[index].quantity = newItem.quantity - 1;

            newOrder.items = updatedItems;
            newOrder.totalAmount = +(newOrder.totalAmount - newItem.price).toFixed(2)

            setOrder({ ...newOrder })

        } else if (item.quantity === 1 && newOrder.items.length > 1) {

            const index = newOrder.items.findIndex(
                (i) => i.id === item.id && i.size === item.size
            );
            const updatedItems = [...newOrder.items];
            updatedItems.splice(index, 1);
            newOrder.totalAmount = +(newOrder.totalAmount - newItem.price).toFixed(2)
            newOrder.items = updatedItems;

            setOrder({ ...newOrder })

        } else {
            alert('Considering canceling this order')
        }



    }

    const handleSaveChanges = async () => {
        try {
            setProcessing(true)
            const res = await dispatch(updateOrder(order))
            if (res) {
                sendNotification('News About Your Order', 'Your order has been updated', order)

                history.goBack()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setProcessing(false)
        }
    }

    const discardChanges = () => {
        setOrder(current)
    }

    useEffect(() => {
        dispatch(getOrder(id))
        if (current) setOrder(current)
        console.log(current)

        //eslint-disable-next-line
    }, [id, dispatch])



    if (loading || !current || processing) return <Loader />

    return (
        <div style={{ maxWidth: '1080px', margin: '1rem auto' }}>
            <Grid container>
                <Grid item xs={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1080px' }}>
                        <BackArrow />
                        <Typography variant='h4' align='center'>
                            Modify Order
                    </Typography>
                        <div>
                            <Button onClick={discardChanges} color='secondary' variant='outlined'>Discard Changes</Button>
                            <Button onClick={handleSaveChanges} color='primary' variant='outlined'>Save Changes</Button>
                        </div>
                    </div>



                </Grid>
                <Grid container>
                    <Grid item sm={6}>
                        <Paper style={{ padding: '1rem' }}>
                            <Typography>Customer: {order?.customer.name} {order?.customer.lastName}</Typography>
                            <Typography style={{ textTransform: 'capitalize' }}>Order Number: {order?.orderNumber}</Typography>
                            <Typography style={{ textTransform: 'capitalize' }}>Order Type: {order?.orderType}</Typography>
                            <Typography style={{ textTransform: 'capitalize' }}>Payment Method: {order?.paymentMethod}</Typography>
                            <Typography style={{ textTransform: 'capitalize' }}>Order Status: {order?.status}</Typography>
                            <Typography style={{ textTransform: 'capitalize' }}>Order Total: ${order?.totalAmount}</Typography>

                        </Paper>
                    </Grid>
                    <Grid item sm={6}>
                        <div className="bottom_details">
                            {order?.items.map((item) => (
                                <OrderItem
                                    onPressAdd={() => handleAddItem(item)}
                                    onPressRemove={() => handleRemoveItem(item)}
                                    editMode={true}
                                    key={item.size ? item.id + item.size : item.id}
                                    item={item}
                                />
                            ))}
                        </div>
                    </Grid>

                </Grid>

            </Grid>
        </div >
    )
}
