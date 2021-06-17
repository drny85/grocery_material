import { Button, Fade, Grid, InputAdornment, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BackArrow from '../../components/BackArrow'
import Loader from '../../components/Loader'
import { getStoreDetails, updateStoreInfo } from '../../reduxStore/actions/storeActions'
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment'

import SaveIcon from '@material-ui/icons/Save';
import EditStoreField from '../../components/EditStoreField'
import Controls from '../../components/controls/Controls'

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,

} from '@material-ui/pickers';
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


    const [weekday, setWeekday] = React.useState(
        { open: new Date('2021 08:00:00 GMT-0500'), close: new Date('2021 22:00:00 GMT-0500') }
    );

    const [friday, setFriday] = React.useState(
        { open: new Date('2021 08:00:00 GMT-0500'), close: new Date('2021 22:00:00 GMT-0500') }
    );

    const [saturday, setSaturday] = React.useState(
        { open: new Date('2021 08:00:00 GMT-0500'), close: new Date('2021 23:00:00 GMT-0500') }
    );

    const [sunday, setSunday] = React.useState(
        { open: new Date('2021 09:00:00 GMT-0500'), close: new Date('2021 20:00:00 GMT-0500') }
    );


    const [editing, setEditing] = useState(false)

    const generateTime = (t) => {
        console.log(moment(t.close).minutes())
        console.log(moment(t.close).minute())
        return `${moment(t.open).hour()}:${moment(t.open).minutes() < 10 ? '0' + moment(t.open).minutes() : moment(t.open).minutes()}am-${moment(t.close).hour() > 12 ? (moment(t.close).hour() - 12) : moment(t.close).hour()}:${moment(t.close).minutes() < 10 ? ('0' + moment(t.close).minutes()) : moment(t.close).minutes()}pm`
    }

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

    const updateStoreHours = () => {
        setStore({
            ...store, hours: {

                mon: generateTime(weekday),
                tue: generateTime(weekday),
                wed: generateTime(weekday),
                thu: generateTime(weekday),
                fri: generateTime(friday),
                sat: generateTime(saturday),
                sun: generateTime(sunday),

            }
        })

        console.log(store.hours)

        // dispatch(updateStoreInfo({
        //     ...store, hours: {

        //         mon: generateTime(weekday),
        //         tue: generateTime(weekday),
        //         wed: generateTime(weekday),
        //         thu: generateTime(weekday),
        //         fri: generateTime(friday),
        //         sat: generateTime(saturday),
        //         sun: generateTime(sunday),

        //     }
        // }))

        setEditing(false)
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
        //setWeekday({ open: current.wee })
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
                            <Button color={editing ? 'primary' : 'secondary'} variant='outlined' onClick={!editing ? () => setEditing(true) : () => {
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

                    <Grid item container style={{ marginTop: '1rem', boxShadow: '5px 2px 5px 3px rgba(0,0,0,0.3)', padding: '1rem 0' }} xs={12}>
                        <Grid item xs={12}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '60%', margin: '1rem auto' }}>
                                <Typography style={{ marginTop: '1rem' }} align='center'>Store Hours</Typography>
                                <Button disabled={!editing} onClick={updateStoreHours} startIcon={<SaveIcon />} variant='outlined' color='primary'>Update Hours</Button>
                            </div>

                        </Grid>
                        <Fade in={true}>
                            <>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">

                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker18"
                                                label="Open Hours from Mon - Thu"
                                                value={weekday?.open}
                                                onChange={time => setWeekday({ ...weekday, open: time })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">

                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker12"
                                                label="Close Hours from Mon - Thu"
                                                value={weekday?.close}
                                                onChange={time => setWeekday({ ...weekday, close: time })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">

                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker1"
                                                label="Open Hours for Fridays"
                                                value={friday.open}
                                                onChange={time => setFriday({ ...friday, open: time })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">

                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker3"
                                                label="Close Hours for Fridays"
                                                value={friday.close}
                                                onChange={time => setFriday({ ...friday, close: time })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                {/* SAturdays hours */}
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">

                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker5"
                                                label="Open Hours for Saturdays"
                                                value={saturday?.open}
                                                onChange={time => setSaturday({ ...saturday, open: time })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">

                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker66"
                                                label="Close Hours for Saturdays"
                                                value={saturday?.close}
                                                onChange={time => setSaturday({ ...saturday, close: time })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">

                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker6"
                                                label="Open Hours for Sundays"
                                                value={sunday?.open}
                                                onChange={time => setSunday({ ...sunday, open: time })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">

                                            <KeyboardTimePicker
                                                margin="normal"
                                                id="time-picker7"
                                                label="Close Hours for Sundays"
                                                value={sunday?.close}
                                                onChange={time => setSunday({ ...sunday, close: time })}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change time',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>

                                </Grid>
                            </>
                        </Fade>

                    </Grid>


                </Grid>
            </div>
        </div>
    )
}

export default StoreInfo
