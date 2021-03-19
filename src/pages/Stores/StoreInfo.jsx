import { Button, Grid, InputAdornment, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BackArrow from '../../components/BackArrow'
import Loader from '../../components/Loader'
import { getStoreDetails, updateStoreInfo } from '../../reduxStore/actions/storeActions'
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

import EditStoreField from '../../components/EditStoreField'
import Controls from '../../components/controls/Controls'
import { deliveryTypes } from '../../utils/constants'


const StoreInfo = () => {
    const { id } = useParams()
    const zipRef = useRef()
    const btnRef = useRef()
    const [zips, setZips] = React.useState([])
    const [deliveryZip, setDeliveryZip] = React.useState('')
    const dispatch = useDispatch()
    const { current, loading } = useSelector(state => state.storesData)
    const [store, setStore] = useState({})

    const [editing, setEditing] = useState(false)

    const handleDeliveryZip = e => {

        e.preventDefault()
        if (deliveryZip.length === 5) {
            const index = zips.indexOf(deliveryZip)
            if (index > -1) {
                if (zips.length === 0) {
                    setZips([...zips, deliveryZip])
                    setDeliveryZip('')


                } else {
                    alert(`${deliveryZip} was already entered`)
                    return;
                }

            } else {

                setZips([...zips, deliveryZip])
                setDeliveryZip('')

            }
        }

    }

    const updateZipcodes = () => {

        dispatch(updateStoreInfo({ ...store, deliveryZip: zips }))
    }

    const handleStoreUpdate = e => {
        let value = e.target.value
        if (e.target.type === 'number') {
            value = Number(e.target.value)
        }
        setStore({ ...store, [e.target.name]: value })
    }

    const addZipByPressingEnter = e => {
        if (e.key === 'Enter') {
            btnRef.current.click()
        }
    }

    const submitUpdate = async () => {
        try {

            dispatch(updateStoreInfo(store))
            setEditing(false)
        } catch (error) {
            console.log(error)
        }

    }


    const deleteZip = e => {
        const index = zips.indexOf(e)
        if (index > -1) {
            const newZips = [...zips]
            newZips.splice(index, 1)
            setZips(newZips)
        }
    }


    useEffect(() => {

        !current && dispatch(getStoreDetails(id))

        return () => {

        }

    }, [id, dispatch, current])

    useEffect(() => {
        setStore(current)
        current && current.deliveryZip && setZips(current.deliveryZip)
        console.log(current)
        //eslint-disable-next-line
    }, [current])


    if (!current || loading) <Loader />

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1080px', margin: '1rem auto', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1080px', margin: '1rem auto', width: '100%' }}>
                <BackArrow />
                <Typography variant='h5'>Store Info</Typography>
                <Typography></Typography>
            </div>
            <div className="content_info">
                <Grid container>
                    <Grid item xs={12}>
                        <Paper style={{ margin: '1rem', padding: '1rem', display: 'flex', justifyContent: 'space-around', backgroundColor: '#eee' }}>
                            <Typography className='capitalize'>Name: {current?.name}</Typography>
                            <Typography className='capitalize'>Address: {current?.street} {current?.city} {current?.state}, {current?.zipcode}</Typography>
                            <Button color='primary' variant='contained' onClick={!editing ? () => setEditing(true) : () => {
                                setStore(current)
                                setEditing(false)
                            }} endIcon={<EditIcon />} >{editing ? 'Cancel' : 'Edit Store'}</Button>
                        </Paper>
                    </Grid>
                    <Grid item container>

                        <EditStoreField title='Estimated Delivery Time' editing={editing} setEditing={setEditing} store={store} handleStoreUpdate={handleStoreUpdate} submitUpdate={submitUpdate} field={'estimatedDeliveryTime'} />
                        <EditStoreField title='Delivery Minimum' type='number' editing={editing} setEditing={setEditing} store={store} handleStoreUpdate={handleStoreUpdate} submitUpdate={submitUpdate} field={'deliveryMinimum'} />
                        {store?.deliveryType && (<div style={{ display: 'flex', width: '100%' }}>
                            <Controls.Select disabled={!editing} style={{ margin: '0.5rem 0rem 0.5rem 1rem', width: editing ? '90%' : '100%', flex: 0.7, }} name='deliveryType' label='Delivery Type' value={store.deliveryType} onChange={handleStoreUpdate} options={deliveryTypes} />
                            {editing && (<Controls.Button style={{ width: '100%', maxWidth: '10rem' }} text='Update' onClick={submitUpdate} />)}
                        </div>)}
                    </Grid>
                    <Grid item xs={12}>
                        <Controls.Input disabled={!editing} style={{ width: '100%', margin: '0.5rem 1rem' }} inputRef={zipRef} name='deliveryZip' label='Delivery Zip Codes' onKeyDown={addZipByPressingEnter} endAdornment={(<InputAdornment position='end'>
                            <>
                                <Button ref={btnRef} onClick={handleDeliveryZip} color='primary' variant='outlined' disabled={deliveryZip.length !== 5}>Add</Button>
                                <Button ref={btnRef} onClick={updateZipcodes} color='secondary' disabled={!editing} variant='outlined'>Done & Update</Button>
                            </>
                        </InputAdornment>)} inputProps={{ maxLength: 5 }} value={deliveryZip} placeholder='10456' onChange={e => setDeliveryZip(e.target.value)} />
                        <div style={{ display: 'flex', margin: '4px 1rem', alignItems: 'center' }}>
                            {zips.map(zip => (
                                <p key={zip} style={{ marginRight: '8px', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>{zip} <CloseIcon onClick={() => deleteZip(zip)} style={{ marginRight: '8px', cursor: 'pointer' }} htmlColor='red' /></p>
                            ))}
                        </div>
                    </Grid>

                </Grid>
            </div>
        </div>
    )
}

export default StoreInfo
