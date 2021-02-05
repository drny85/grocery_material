import { Grid, Paper, Typography } from '@material-ui/core'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import BackArrow from '../../components/BackArrow'
import Controls from '../../components/controls/Controls'
import { Form, useForm } from '../../components/useForm'
import { clearStoreError, newStoreApplication } from '../../reduxStore/actions/storeActions'
import { deliveryStates } from '../../utils/constants'

import Message from '../../components/Message'
import { phoneFormatted } from '../../utils/phoneFormatted'

const initialValues = {
    name: '',
    owner: '',
    street: '',
    phone: '',
    ownerPhone: '',
    email: '',
    state: '',
    city: '',
    status: 'pending',
    zipcode: ''
}

const StoreApplication = ({ history }) => {
    const dispatch = useDispatch()
    const [checkStatus, setCheckStatus] = useState(true)
    const { error } = useSelector(state => state.storesData)
    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("name" in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required.";
        if ("owner" in fieldValues)
            temp.owner = fieldValues.owner ? "" : "Owner name  is required.";
        if ("street" in fieldValues)
            temp.street =
                fieldValues.street
                    ? ""
                    : "Street name is required.";

        if ("city" in fieldValues)
            temp.city =
                fieldValues.city.length !== 0 ? "" : "A city name is required";
        if ("state" in fieldValues)
            temp.state =
                fieldValues.state.length !== 0 ? "" : "State is required";
        if ("zipcode" in fieldValues)
            temp.zipcode =
                fieldValues.zipcode.length !== 0 ? "" : "Zip code is required";

        if ("phone" in fieldValues)

            temp.phone = fieldValues.phone.length >= 10 ? '' : 'Invalid phone'
        if ("ownerPhone" in fieldValues)

            temp.ownerPhone = fieldValues.ownerPhone.length >= 10 ? '' : 'Invalid phone'
        if ("email" in fieldValues)

            temp.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fieldValues.email) ? '' : 'Invalid email'


        setErrors({
            ...temp,
        });


        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };



    const { values, handleInputChange, errors, resetForm, setErrors } = useForm(initialValues, true, validate)

    const reformatPhone = e => {
        const ph = phoneFormatted(e.target.value)

        const target = { target: { name: e.target.name, value: ph } }
        handleInputChange(target)

    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (validate()) {
            try {
                values.appliedOn = new Date().toISOString()
                const { success, id } = await dispatch(newStoreApplication(values))
                console.log(success, id)
                if (success) {
                    resetForm()
                    history.replace(`/store/application/status/${id}`)
                } else {

                    setTimeout(() => {
                        dispatch(clearStoreError())
                    }, 5000);
                }

            } catch (error) {
                console.log(error)
            }

        } else {
            console.error('missing fileds')

        }
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', width: '100%', height: '100%', maxWidth: '1080px', alignItems: 'center' }}>
            {checkStatus ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
                    <Typography style={{ margin: '0.2rem' }} align='center' variant='body1'>What would like to do?</Typography>
                    <Controls.Button onClick={() => setCheckStatus(false)} style={{ width: '200px', margin: '2rem 0' }} text='New Application' />
                    <Controls.Button onClick={() => history.push('/store/application/status/check')} style={{ width: '200px' }} text='Check Status' />



                </div>

            ) : (<Paper>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1080px', marginTop: '1rem' }}>
                    <BackArrow onClick={() => setCheckStatus(true)} />
                    <Typography variant='h5'>Store Application</Typography>
                    <Typography></Typography>

                </div>
                <div style={{ padding: '0 auto', margin: '1rem auto', width: '100%', maxWidth: '1080px' }}>

                    <Form onSubmit={handleSubmit}>
                        <Grid container alignContent='center' justify='center'>
                            <Grid item xs={10} md={8} lg={7}>
                                {error && (<Message message={error} severity='error' />)}
                            </Grid>
                            <Grid item xs={10} md={8} lg={7}>
                                <Controls.Input name='name' inputProps={{ style: { textTransform: 'capitalize' } }} value={values.name} placeholder={"John's Restaurant"} error={errors.name} label='Store Name' onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={10} md={8} lg={7}>
                                <Controls.Input name='owner' inputProps={{ style: { textTransform: 'capitalize' } }} value={values.owner} error={errors.owner} label='Owner Full Name' placeholder='John Smith' onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={10} md={8} lg={7}>
                                <Controls.Input name='street' inputProps={{ style: { textTransform: 'capitalize' } }} value={values.street} error={errors.street} placeholder='123 Main St' label='Street Name' onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={10} md={8} lg={7}>
                                <Controls.Input name='city' value={values.city} inputProps={{ style: { textTransform: 'capitalize' } }} placeholder="Manhattan" error={errors.city} label='City Name' onChange={handleInputChange} />
                            </Grid>
                            <Grid item container xs={10} md={8} lg={7}>
                                <Grid item xs={12} md={6}>
                                    <Controls.Select style={{ marginRight: '8px' }} name='state' value={values.state} error={errors.state} label='Select a State' options={deliveryStates} onChange={handleInputChange} />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Controls.Input style={{ marginLeft: '8px' }} name='zipcode' value={values.zipcode} error={errors.zipcode} placeholder='12345' label='Zip Code' onChange={handleInputChange} />
                                </Grid>
                            </Grid>

                            <Grid item xs={10} md={8} lg={7}>
                                <Controls.Input name='phone' placeholder={'1234567890'} onBlur={reformatPhone} inputProps={{ maxLength: 12, minLength: 10 }} value={values.phone} error={errors.phone} label='Store Phone' onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={10} md={8} lg={7}>
                                <Controls.Input name='ownerPhone' onBlur={reformatPhone} placeholder={'1234567890'} inputProps={{ maxLength: 12, minLength: 10 }} value={values.ownerPhone} error={errors.ownerPhone} label='Owner Cell Phone' onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={10} md={8} lg={7}>
                                <Controls.Input name='email' value={values.email} error={errors.email} placeholder='john.smith@email.com' label='Email Address' onChange={handleInputChange} />
                            </Grid>


                        </Grid>
                        <Grid container item sx={12} alignContent='center' justify='center'>
                            <div style={{ marginTop: '1rem' }}>
                                <Controls.Button text='Submit Application' type='submit' />
                                <Controls.Button text='Reset Form' color='secondary' type='reset' onClick={resetForm} />
                            </div>
                        </Grid>

                    </Form>
                </div>
            </Paper>
                )}

        </div>
    )
}

export default StoreApplication
