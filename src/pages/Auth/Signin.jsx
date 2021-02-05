import React, { useEffect } from 'react'
import Controls from '../../components/controls/Controls'
import { Grid } from '@material-ui/core';
import { useForm, Form } from '../../components/useForm'
import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

import './styles.css'
import { signin } from '../../reduxStore/actions/userActions';
import { Link, useHistory } from 'react-router-dom';
import Message from '../../components/Message';

const initialValues = {
    email: '',
    password: '',
};


const Signing = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { user, error } = useSelector(state => state.userData)


    const validate = (fieldValues = values) => {
        let temp = { ...errors };

        if ('email' in fieldValues)
            temp.email = fieldValues.email.length !== 0 ? '' : 'Email is required';
        if ('email' in fieldValues)
            temp.email = temp.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fieldValues.email) ? '' : 'Invalid email'


        if ('password' in fieldValues)
            temp.password =
                fieldValues.password.length !== 0 ? '' : 'Password is required.';

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === '');
    };


    const { values, handleInputChange, errors, setErrors, resetForm } = useForm(
        initialValues,
        true,
        validate
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log(values)
            dispatch(signin(values));
            if (user) {
                resetForm()
            } else {
                return
            }

        }
    };

    useEffect(() => {
        user && history.replace('/')
    }, [user, history])
    return (
        <div className="auth_login_container">
            <div className='error_message'>
                {error && (<Message message={error} severity='error' />)}
            </div>
            <Form onSubmit={handleSubmit}>
                <Grid
                    container
                    alignContent='center'
                    justify='center'
                    direction='column'
                >
                    {/* {error && <Message type='error'>{error}</Message>} */}
                    <Grid item sx={12} md={12}>
                        <Controls.Input
                            name='email'
                            fontSize={32}
                            value={values.email}
                            error={errors.email}
                            label='Email'
                            onChange={handleInputChange}
                        />

                        <Controls.Input
                            name='password'
                            type='password'
                            fontSize={32}
                            value={values.password}
                            error={errors.password}
                            label='Password'
                            style={{ color: 'white' }}
                            onChange={handleInputChange}
                        />

                        {/* <Controls.Select  /> */}
                        <div style={{ margin: '15px 10px', width: '100%' }}>
                            <Controls.Button type='submit' text='LOGIN' style={{ width: '100%' }} />
                            {/* <Controls.Button
                                text='Reset'
                                color='default'
                                onClick={resetForm}
                            /> */}
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <p style={{ padding: '2rem 1rem', color: 'GrayText' }}>
                            Do not have an account?{' '}
                            <span style={{ marginLeft: '10px' }}>
                                <Link to='/store/application'>Sign Up</Link>
                            </span>
                        </p>
                    </Grid>
                </Grid>
            </Form>
        </div>
    )
}

export default Signing
