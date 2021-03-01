import { Grid, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import Controls from '../../../components/controls/Controls'
import { Form, useForm } from '../../../components/useForm'
import moment from 'moment'

import { useDispatch, useSelector } from 'react-redux'
import { addCoupon, getCoupons } from '../../../reduxStore/actions/couponsActions'

const initialValues = { code: '', value: '', expires: '' };

const CouponsPage = () => {
    const dispatch = useDispatch()
    const { coupons } = useSelector(state => state.couponsData)

    const handleCoupon = async (e) => {
        e.preventDefault()
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
    };

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
        resetForm,
    } = useForm(initialValues, true, validate);

    useEffect(() => {

        coupons.length === 0 && dispatch(getCoupons())
        return () => {

        }
        //eslint-disable-next-line
    }, [dispatch, coupons.length])

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
            <div className='title'>
                <Typography align='center' variant='h5'>Coupons</Typography>
            </div>
            <Grid container>
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

                    <Controls.Button type='submit' text='Add Coupon' />
                </Form>
            </Grid>
        </div>
    )
}

export default CouponsPage
