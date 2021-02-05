import { Grid, Typography } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import Controls from '../../components/controls/Controls'
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
import { signin } from '../../reduxStore/actions/userActions'

const initialState = {}


const StoreProfile = () => {

    const { id } = useParams()
    const history = useHistory()
    const estRef = useRef()
    const zipRef = useRef()
    const dispatch = useDispatch()
    const { current, error } = useSelector(state => state.storesData)
    const [estimated, setEstimated] = React.useState('')
    const [deliveryZip, setDeliveryZip] = React.useState('')
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
        if (deliveryZip.length < 5) {
            alert('Please enter all delivery zipcodes')
            zipRef.current.focus()
            return false

        } else if (deliveryZip.length >= 5) {
            const v = deliveryZip.split(', ')
            v.forEach(i => {
                if (i.length !== 5) {

                    alert('Please make sure to separate zipcode by commas then space. Check example')
                    zipRef.current.focus()
                    return false
                } else {
                    setDeliveryZip(v)
                    return true
                }
            })
        }




    }

    const generateTime = (t) => {
        return `${moment(t.open).hour()}:${moment(weekday.open).minute() < 10 ? '0' + moment(t.open).minute() : moment(t.open).minute()}am-${moment(t.close).hour() > 12 ? (moment(t.close).hour() - 12) : moment(t.close).hour()}:${moment(t.close).minute() < 10 ? '0' + moment(t.close).minute() : moment(weekday.close).minute()}pm`
    }

    const { values, setValues } = useForm(initialState, true, validate)


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validate()) {
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
            values.password = password
            values.deliveryZip = deliveryZip



            const res = await dispatch(updateStoreApplication(values))
            if (res.success) {
                dispatch(signin(res.email, res.password))
                history.replace('/')
            }
        }
    }

    useEffect(() => {
        dispatch(getStoreDetails(id))
        if (current) {
            setValues(current)
        }

        //eslint-disable-next-line
    }, [id, dispatch])

    if (!current) return <Loader />
    console.log(deliveryZip.slice(0, -1))
    console.log(deliveryZip.split(', '))

    return (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1080px', margin: '1rem auto' }}>
            <Typography variant='h6' align='center'>Store Profile</Typography>
            <Typography variant='caption' style={{ fontStyle: 'italic', textAlign: 'center', marginTop: '1rem' }}>Please fill out all the information bellow</Typography>
            <div style={{ width: '100%', margin: '10px auto' }}>
                {error && <Message message={error} severity='error' />}
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
                                <Controls.Input value={password} label='Password' type='password' error={password.length < 6 && password.length > 1 ? 'At least 6 characters required' : null} onChange={e => setPassword(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controls.Input value={confirm} label='Confirm Password' type='password' error={confirm !== password && confirm.length > 5 ? 'Passwords must match' : null} onChange={e => setConfirm(e.target.value)} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginLeft: '1rem' }} variant='caption'>Note: your application was submitted on {moment(values.appliedOn).format('LLL')} and was approved on {moment(values.approvedOn).format('LLL')}</Typography>
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
                                            onChange={time => setWeekday({ ...friday, close: time })}
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
                                <Controls.Input inputRef={estRef} name='estimated' label='Estimated Delivery Time' placeholder='25-30' value={estimated} onChange={e => setEstimated(e.target.value)} />
                                <span style={{ marginLeft: '1rem', fontSize: '12px' }}>{estimated !== '' && (estimated + ' mins')}</span>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography style={{ marginLeft: '1rem' }} variant='caption'>Note: Please enter all the zip codes your store will be making deliveries separated by commas</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Controls.Input inputRef={zipRef} name='deliveryZip' label='Delivery Zip Codes' value={deliveryZip} placeholder='10456,10458,10451' onChange={e => setDeliveryZip(e.target.value)} />
                            </Grid>



                        </Grid>
                        <Grid item style={{ marginTop: '1rem' }}>
                            <Controls.Button text='Update My Store Information' type='submit' />

                        </Grid>

                    </Grid>
                </Form>
            </div>
        </div>
    )
}

export default StoreProfile
