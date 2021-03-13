import { Button, Grid, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BackArrow from '../../components/BackArrow'
import Loader from '../../components/Loader'
import { getStoreDetails, updateStoreInfo } from '../../reduxStore/actions/storeActions'
import EditIcon from '@material-ui/icons/Edit';

import EditStoreField from '../../components/EditStoreField'


const StoreInfo = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { current, loading } = useSelector(state => state.storesData)
    const [store, setStore] = useState({})

    const [editing, setEditing] = useState(false)



    const handleStoreUpdate = e => {
        let value = e.target.value
        if (e.target.type === 'number') {
            value = Number(e.target.value)
        }
        setStore({ ...store, [e.target.name]: value })
    }

    const submitUpdate = async () => {
        try {
            dispatch(updateStoreInfo(store))
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {

        !current && dispatch(getStoreDetails(id))

        return () => {

        }

    }, [id, dispatch, current])

    useEffect(() => {
        setStore(current)
        //eslint-disable-next-line
    }, [current])

    console.log(store)

    if (!current || loading) <Loader />

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1080px', margin: '1rem auto' }}>
                <BackArrow />
                <Typography variant='h5'>Store Info</Typography>
                <Typography></Typography>
            </div>
            <div className="content_info">
                <Grid container>
                    <Grid item xs={12}>
                        <Paper style={{ margin: '1rem', padding: '1rem', display: 'flex', justifyContent: 'space-around' }}>
                            <Typography className='capitalize'>Name: {current?.name}</Typography>
                            <Typography className='capitalize'>Address: {current?.street} {current?.city} {current?.state}, {current?.zipcode}</Typography>
                            <Button color='primary' variant='outlined' onClick={!editing ? () => setEditing(true) : () => {
                                setStore(current)
                                setEditing(false)
                            }} endIcon={<EditIcon />} >{editing ? 'Cancel' : 'Edit Store'}</Button>
                        </Paper>
                    </Grid>
                    <Grid item container>

                        <EditStoreField title='Estimated Delivery Time' editing={editing} setEditing={setEditing} store={store} handleStoreUpdate={handleStoreUpdate} submitUpdate={submitUpdate} field={'estimatedDeliveryTime'} />
                        <EditStoreField title='Delivery Minimum' type='number' editing={editing} setEditing={setEditing} store={store} handleStoreUpdate={handleStoreUpdate} submitUpdate={submitUpdate} field={'deliveryMinimum'} />
                        <EditStoreField title='Delivery Minimum' type='number' editing={editing} setEditing={setEditing} store={store} handleStoreUpdate={handleStoreUpdate} submitUpdate={submitUpdate} field={'deliveryMinimum'} />


                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default StoreInfo
