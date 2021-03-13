import { Grid, Typography, useTheme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Controls from '../../../components/controls/Controls'
import { Form, useForm } from '../../../components/useForm'
import moment from 'moment'

import { useDispatch, useSelector } from 'react-redux'
import { addCoupon, deleteCoupon, getCoupons, updateCoupon } from '../../../reduxStore/actions/couponsActions'
import EditIcon from '@material-ui/icons/Edit';
import Loader from '../../../components/Loader'
import BackArrow from '../../../components/BackArrow'

const initialValues = { code: '', value: '', expires: '' };

const CouponsPage = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { coupons, loading } = useSelector(state => state.couponsData)
    const [updating, setUpdating] = useState(false)
    const [couponId, setCouponId] = useState(null)

    const handleCoupon = async (e) => {
        e.preventDefault()
        if (!updating) {
            try {
                if (coupons.find(c => c.code.toLowerCase() === values.code.trim().toLowerCase())) {
                    alert('Coupon Code already exists')
                    return;
                }
                if (validate()) {
                    values.value = Number(values.value);
                    const n = moment(values.expires).endOf('day');
                    values.expires = new Date(n).toISOString()

                    const { sucess } = await dispatch(addCoupon(values))
                    if (!sucess) return;

                    resetForm()

                }
            } catch (error) {
                console.error(error);
            }
        } else {
            //update coupons

            if (validate()) {
                values.value = Number(values.value);
                const n = moment(values.expires).endOf('day');
                values.expires = new Date(n).toISOString()

                const updated = await dispatch(updateCoupon(values))
                console.log(updated)
                if (updated) {
                    setValues(initialValues)
                    setUpdating(false)
                } else {
                    return
                }

            }

        }

    };

    const handleDeleteCoupon = async () => {
        const deleted = await dispatch(deleteCoupon(couponId))
        if (deleted) {
            console.log(deleted)
            setUpdating(false)
            setValues(initialValues)
            setCouponId(null)
        } else {
            return
        }
    }

    const updateCouponHandler = id => {
        setUpdating(true)
        setCouponId(id)
        const coupon = coupons.find(c => c.id === id)

        setValues(coupon)


    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors };

        if ('code' in fieldValues)
            temp.code = fieldValues.code ? '' : 'Code is required';
        if ('value' in fieldValues)
            temp.value = fieldValues.value.length !== 0 ? '' : 'Value is required';
        if ('expires' in fieldValues)
            temp.expires =
                fieldValues.expires.length !== 0 ? '' : 'A date is required';

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === '');
    };

    const {
        values,
        handleInputChange,
        errors,
        setErrors,
        setValues,
        resetForm,
    } = useForm(initialValues, true, validate);

    useEffect(() => {

        const subs = async () => await dispatch(getCoupons())

        return () => {
            subs && subs()
        }
        //eslint-disable-next-line
    }, [dispatch])

    useEffect(() => {
        coupons.length === 0 && dispatch(getCoupons())
    }, [coupons.length, dispatch])

    return (
        <div
            style={{
                display: 'grid',
                placeItems: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '1rem auto'
            }}
        >
            <div className='title' style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <BackArrow />
                <Typography align='center' variant='h5'>Coupons</Typography>
                <Typography></Typography>
            </div>
            <Grid container>
                <Grid item xs={12} >


                    <Form onSubmit={handleCoupon}>
                        <Controls.Input
                            name='code'
                            label='Coupon Code'
                            error={errors.code}
                            inputProps={{ style: { textTransform: 'uppercase' } }}
                            value={values.code}
                            onChange={handleInputChange}
                        />
                        <Controls.Input
                            name='value'
                            type='number'
                            label='Coupon Percentage'
                            error={errors.value}
                            value={values.value}
                            placeholder='10'
                            inputProps={{ min: 0, max: 99 }}
                            onChange={handleInputChange}
                        />

                        <Controls.Input
                            name='expires'
                            label='Expires On'
                            error={errors.expires}
                            type='date'
                            value={values.expires}
                            onChange={handleInputChange}
                        />
                        <div className="buttons">
                            <Controls.Button type='submit' text={updating ? 'Update Coupon' : 'Add Coupon'} style={{ backgroundColor: updating ? theme.palette.success.main : theme.palette.primary.main }} />
                            {updating && (<Controls.Button text='Delete' style={{ backgroundColor: theme.palette.error.main }} onClick={handleDeleteCoupon} />)}
                            {updating && (<Controls.Button text='Cancel' style={{ backgroundColor: theme.palette.info.main }} onClick={() => {
                                setUpdating(false)
                                setValues(initialValues)
                                setCouponId(null)
                            }} />)}
                        </div>

                    </Form>
                </Grid>
                <Grid item xs={12}>

                    <div className="coupons" style={{ marginTop: '1rem' }}>
                        {coupons.length > 0 ?
                            (coupons.map(coupon => (<div key={coupon.id + coupon.code} style={{ padding: '1rem 1.5rem', boxShadow: '2px 4px 5px rgba(0,0,0,0.5)', margin: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>{coupon.code.toUpperCase()}</Typography>
                                <Typography>{coupon.value}</Typography>
                                <Typography>{moment(coupon.expires).format('LLL')}</Typography>
                                <EditIcon elevation={10} cursor='pointer' onClick={() => updateCouponHandler(coupon.id)} />

                            </div>)))
                            : loading ? <Loader /> : (<div><Typography>No Coupons</Typography></div>)}
                    </div>

                </Grid>
            </Grid>
        </div>
    )
}

export default CouponsPage
