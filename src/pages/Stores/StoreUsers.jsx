import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import BackArrow from '../../components/BackArrow'
import Controls from '../../components/controls/Controls'
import Message from '../../components/Message'
import { Form } from '../../components/useForm'
import { db } from '../../database'
import { phoneFormatted } from '../../utils/phoneFormatted'

const StoreUsers = () => {

    const [show, setShow] = useState(false)
    const [username, setUsername] = useState('')
    const [pin, setPin] = useState('')
    const [verifyPin, setVerifyPin] = useState('')
    const [fullName, setFullname] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('')
    const [error, setError] = useState(null)
    const { store } = useSelector(state => state.userData)

    const addUserHandler = async (e) => {
        e.preventDefault()
        const user = {
            username,
            pin,
            fullName,
            phone,
            isAdmin: role === 'Admin' ? true : false,
            isActive: true,
            storeId: store.id,
            addedOn: new Date().toISOString(),
            addedBy: store.userId
        }
        if (pin !== verifyPin) {
            generateError('Pins must match')
            return;
        }
        if (username === '' || pin === '' || phone === '' || fullName === '') {
            generateError('All fields are required')
            return
        }


        try {
            await db.collection('stores').doc(store.id).collection('users').add(user)
            setShow(false)
        } catch (error) {
            console.log(error.message)

        }
    }

    const generateError = e => {
        setError(e)
        setTimeout(() => {
            setError(null)
        }, 4000)
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1080px', margin: '1rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BackArrow />
                <Typography>Store Users</Typography>
                <Controls.Button text='Add New User' size='small' onClick={() => setShow(true)} />
            </div>
            <div>
                <Grid container>
                    <Grid item>

                    </Grid>
                </Grid>
            </div>
            <Dialog open={show}>
                <DialogTitle>Adding New User</DialogTitle>
                <DialogContent>
                    <>
                        {error && <Message message={error} severity='error' />}
                        <Form>
                            <Controls.Input name='username' label='Username' error={username.length > 0 && username.length < 3 ? 'username must be at least 3 characters long' : null} value={username} onChange={e => setUsername(e.target.value)} />

                            <Controls.Input name='fullName' inputProps={{ style: { textTransform: 'capitalize' } }} label="Full Name" value={fullName} onChange={e => setFullname(e.target.value)} />
                            <Controls.Select name='role' error={role === '' ? 'A role is required' : null} label="Select a Role" value={role} onChange={e => setRole(e.target.value)} options={['Admin', 'Active']} />
                            <Controls.Input name='Phone' onBlur={e => setPhone(phoneFormatted(e.target.value))} label='Phone' value={phone} onChange={e => setPhone(e.target.value)} />
                            <Controls.Input name='pin' label='PIN' value={pin} onChange={e => setPin(e.target.value)} />
                            <Controls.Input name='verifyPin' label='Verify PIN' inputProps={{ minLength: 4 }} error={verifyPin.length > 0 && verifyPin !== pin ? 'Pin does not match' : null} value={verifyPin} onChange={e => setVerifyPin(e.target.value)} />
                        </Form>
                    </>
                </DialogContent>
                <DialogActions>
                    <Controls.Button text='Cancel' onClick={() => setShow(false)} />
                    <Controls.Button text='Add User' onClick={addUserHandler} />
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default StoreUsers
