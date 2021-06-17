import { Button, Grid, IconButton, InputAdornment, Typography } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import Controls from '../../components/controls/Controls'
import CloseIcon from '@material-ui/icons/Close';
import { Form, useForm } from '../../components/useForm'
import { getStoreDetails, updateStoreApplication } from '../../reduxStore/actions/storeActions'

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,

} from '@material-ui/pickers';

import moment from 'moment'

import Loader from '../../components/Loader'
import Message from '../../components/Message'

import { storage } from '../../database'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const initialState = {}


const StoreProfile = () => {

    const { id } = useParams()
    const history = useHistory()
    const estRef = useRef()
    const minRef = useRef()
    const zipRef = useRef()
    const picRef = useRef()
    const btnRef = useRef()
    const dispatch = useDispatch()
    const { current, error: storeError } = useSelector(state => state.storesData)
    const [estimated, setEstimated] = React.useState('')
    const [deliveryType, setDeliveryType] = React.useState('both')
    const [submitting, setSubmitting] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [imageUrl, setImageUrl] = React.useState('')
    const [minimum, setMinimum] = React.useState('')

    const [deliveryZip, setDeliveryZip] = React.useState('')
    const [zips, setZips] = React.useState([])
    const [password, setPassword] = React.useState('')
    const [confirm, setConfirm] = React.useState('')

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


    const validate = () => {
        if (password === '' || confirm === '') {
            alert('Please check both password fields')
            return false
        }
        if (estimated === '') {
            alert('Please enter a delivery time')
            estRef.current.focus()
            return false
        }
        if (zips.length < 1 && deliveryType !== 'pickupOnly') {
            alert('Please enter all delivery zipcodes')
            zipRef.current.focus()
            return false

        }
        if (minimum === '' && deliveryType !== 'pickupOnly') {
            alert('Please enter a minimum amount for delivery')
            minRef.current.focus()
            return false
        }

        return true
    }

    console.log(storeError)
    const generateTime = (t) => {
        return `${moment(t.open).hour()}:${moment(weekday.open).minute() < 10 ? '0' + moment(t.open).minute() : moment(t.open).minute()}am-${moment(t.close).hour() > 12 ? (moment(t.close).hour() - 12) : moment(t.close).hour()}:${moment(t.close).minute() < 10 ? '0' + moment(t.close).minute() : moment(weekday.close).minute()}pm`
    }

    const { values, setValues } = useForm(initialState, true, validate)

    const handleStorePic = event => {
        const image = event.target.files && event.target.files[0]

        if (image) {

            if (image.type.includes('image') || image.type.includes('images')) {
                const fileReader = new FileReader()
                fileReader.onload = function (e) {
                    setImageUrl(e.target.result)
                }

                fileReader.readAsDataURL(image)
            } else {
                alert('Please select a valid image')
            }
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword(preview => !preview)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


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

    const addZipByPressingEnter = e => {
        if (e.key === 'Enter') {
            btnRef.current.click()
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validate()) {
            setSubmitting(true)

            try {

                const task = storage.ref(`/images/${picRef.current.files[0].name}`).put(picRef.current.files[0])

                task.on('state_changed', (snapShop) => {

                }, (err) => {
                    console.log(err)
                }, () => {
                    storage.ref('images').child(picRef.current.files[0].name).getDownloadURL().then(async url => {
                        values.imageUrl = url
                        values.hours = {
                            mon: generateTime(weekday),
                            tue: generateTime(weekday),
                            wed: generateTime(weekday),
                            thu: generateTime(weekday),
                            fri: generateTime(friday),
                            sat: generateTime(saturday),
                            sun: generateTime(sunday),
                        }
                        values.open = true
                        values.updatedOn = new Date().toISOString()
                        values.estimatedDeliveryTime = estimated
                        values.hasItems = false
                        values.chargeCardFee = false
                        values.deliveryType = deliveryType
                        values.deliveryMinimum = deliveryType !== 'pickupOnly' ? parseInt(minimum) : null
                        values.password = password
                        values.deliveryZip = deliveryType !== 'pickupOnly' ? zips : null
                        values.profileCreated = true

                        const success = await dispatch(updateStoreApplication(values))
                        console.log(success, storeError)
                        if (!storeError && success) {
                            console.log(success)

                            history.replace('/')

                        } else {

                            console.log(storeError)
                            return
                        }
                    })
                })
            } catch (err) {
                console.log(err)
            } finally {
                setSubmitting(false)
            }


        }
    }

    useEffect(() => {
        dispatch(getStoreDetails(id))

        //eslint-disable-next-line
    }, [id, dispatch])

    useEffect(() => {
        if (current) {
            setValues(current)
        }
        return () => {

        }
    }, [current, setValues])

    if (!current || submitting) return <Loader />

    return (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1080px', margin: '1rem auto' }}>
            <Typography variant='h6' align='center'>Store Profile</Typography>
            <Typography variant='caption' style={{ fontStyle: 'italic', textAlign: 'center', marginTop: '1rem' }}>Please fill out all the information bellow</Typography>
            <div style={{ width: '100%', margin: '10px auto', alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {storeError && <Message message={storeError} severity='error' />}
            </div>
            <div className="form_div" style={{ maxWidth: '800px', margin: '1rem auto' }}>
                <Form onSubmit={handleSubmit}>
                    <Grid container>

                        <Grid item xs={12}>
                            <Controls.Input value={values.name} label='Store Name' disabled={true} inputProps={{ style: { textTransform: 'capitalize' } }} />
                            <Controls.Input value={values.owner} label='Owner Name' disabled={true} inputProps={{ style: { textTransform: 'capitalize' } }} />

                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={values.street} label='Street Name' focus={true} disabled={true} inputProps={{ style: { textTransform: 'capitalize' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={values.city} label='City Name' disabled={true} inputProps={{ style: { textTransform: 'capitalize' } }} />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={values.state} label='State' focus={true} disabled={true} inputProps={{ style: { textTransform: 'capitalize' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={values.zipcode} label='Zip Code' disabled={true} inputProps={{ style: { textTransform: 'capitalize' } }} />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={values.email} label='Email Address' focus={true} disabled={true} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={values.phone} label='Store Phone' disabled={true} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginLeft: '1rem' }} variant='caption'>Note: You will need this password to login into yuor store's account</Typography>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={password} label='Password' type={showPassword ? 'text' : 'password'} endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                } error={password.length < 6 && password.length > 1 ? 'At least 6 characters required' : null} onChange={e => setPassword(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={confirm} label='Confirm Password' type={showPassword ? 'text' : 'password'} endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>} error={confirm !== password && confirm.length > 5 ? 'Passwords must match' : null} onChange={e => setConfirm(e.target.value)} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginLeft: '1rem' }} variant='caption'>Note: your application was submitted on {moment(values.appliedOn).format('LLL')} and was approved on {moment(values.approvedOn).format('LLL')}</Typography>
                        </Grid>
                        {/* STORE PICTURE UPLOAD */}
                        <Grid item container alignContent='center' justify='center' style={{ height: '10rem', margin: '1rem' }}>
                            <Grid item xs={7}>
                                <input style={{ display: 'none' }} ref={picRef} type="file" onChange={handleStorePic} />
                                <Button onClick={() => picRef.current.click()} color='primary' variant='outlined'>{imageUrl ? 'Change Picture' : 'Add Store Picture'}</Button>
                            </Grid>
                            <Grid style={{ position: 'relative' }} item xs={5}>
                                <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', maxHeight: '10rem' }} src={imageUrl ? imageUrl : 'https://www.gaithersburgdental.com/wp-content/uploads/2016/10/orionthemes-placeholder-image.png'} alt="Store Pic" />
                                <p style={{ position: 'absolute', bottom: 5, right: 5, color: '#eee', fontSize: '1.1rem', textTransform: 'capitalize', padding: '0.5rem' }}>{values.name}</p>
                            </Grid>

                        </Grid>
                        <Grid item xs={12}><Typography style={{ marginTop: '1rem' }} align='center'>Store Hours</Typography></Grid>
                        <Grid item container style={{ marginTop: '1rem' }} xs={12}>

                            <Grid item xs={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">

                                        <KeyboardTimePicker
                                            margin="normal"
                                            id="time-picker18"
                                            label="Open Hours from Mon - Thu"
                                            value={weekday.open}
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
                                            value={weekday.close}
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
                                            value={saturday.open}
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
                                            value={saturday.close}
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
                                            value={sunday.open}
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
                                            value={sunday.close}
                                            onChange={time => setSunday({ ...sunday, close: time })}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                            }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Controls.Select label='Delivery Type' onChange={e => setDeliveryType(e.target.value)} value={deliveryType} name='deliveryType' options={[{ id: 'both', name: 'Delivery & Pick up' }, { id: 'deliveryOnly', name: 'Delivery Only' }, { id: 'pickupOnly', name: 'Pick up Only' }]} />
                            </Grid>
                            <Grid item xs={12}>
                                <Controls.Input inputRef={estRef} name='estimated' label='Estimated Delivery / Pick Up Time' placeholder='25-30' value={estimated} onChange={e => setEstimated(e.target.value)} />
                                <span style={{ marginLeft: '1rem', fontSize: '12px' }}>{estimated !== '' && (estimated + ' mins')}</span>
                            </Grid>


                            {deliveryType !== 'pickupOnly' && (
                                <>
                                    <Grid item xs={12}>
                                        <Controls.Input inputRef={minRef} name='minimum' label='Delivery Minimum Amount' placeholder='10' value={minimum} type='number' startAdornment={<InputAdornment position="start">$</InputAdornment>} inputProps={{ min: 0, max: 30 }} step="1.00" onChange={e => setMinimum(e.target.value)} />
                                        <span style={{ marginLeft: '1rem', fontSize: '12px' }}>{minimum !== '' && (minimum + ' Dollars')}</span>
                                    </Grid>
                                    <Grid item xs={12}>

                                        <Controls.Input inputRef={zipRef} name='deliveryZip' label='Delivery Zip Codes' onKeyDown={addZipByPressingEnter} endAdornment={(<InputAdornment position='end'><Button ref={btnRef} onClick={handleDeliveryZip} color='primary' variant='outlined' disabled={deliveryZip.length !== 5}>Add</Button></InputAdornment>)} inputProps={{ maxLength: 5 }} value={deliveryZip} placeholder='10456' onChange={e => setDeliveryZip(e.target.value)} />
                                        <div style={{ display: 'flex', margin: '4px 10px', alignItems: 'center' }}>
                                            {zips.map(zip => (
                                                <p key={zip} style={{ marginRight: '8px', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>{zip} <CloseIcon onClick={() => deleteZip(zip)} style={{ marginRight: '8px', cursor: 'pointer' }} htmlColor='red' /></p>
                                            ))}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography style={{ marginLeft: '1rem' }} variant='caption'>Note: Please enter all the zip codes your store will be making deliveries.</Typography>
                                    </Grid>
                                </>
                            )
                            }

                        </Grid>
                        <Grid item style={{ marginTop: '1rem' }}>
                            <Controls.Button text='Update My Store Information' onClick={handleSubmit} />

                        </Grid>

                    </Grid>
                </Form>
            </div>
        </div >
    )
}

export default StoreProfile
