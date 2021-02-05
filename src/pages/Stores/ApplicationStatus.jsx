import { Grid, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackArrow from '../../components/BackArrow'
import Controls from '../../components/controls/Controls'
import Message from '../../components/Message'
import { Form } from '../../components/useForm'
import { db } from '../../database'
import { phoneFormatted } from '../../utils/phoneFormatted'

const ApplicationStatus = ({ history }) => {
    const { id } = useParams()
    const zipRef = useRef()
    const [phone, setPhone] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [store, setStore] = useState(null)
    const [error, setError] = useState(null)

    const checkStatus = async () => {

        await db.collection('stores').where('phone', '==', phone).where('zipcode', '==', zipcode).get().then(stores => {
            const st = []
            stores.forEach(s => {
                if (s.exists) {
                    st.push({ id: s.id, ...s.data() })
                } else {
                    setError('No Information Found')
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                }
            })
            setStore(st[0])
            history.push(`/store/application/status/${st[0].id}`)
        })
            .catch(error => {
                console.error(error.message)
                setError('No Data Found. Make sure you entered the right information')
                setTimeout(() => {
                    setError(null)
                }, 4000)
            })

    }



    const clearForm = () => {
        setPhone('')
        setZipcode('')

    }

    const checkForStore = async () => {
        const res = await db.collection('stores').doc(id).get()
        setStore({ id: res.id, ...res.data() })
    }

    useEffect(() => {
        if (id !== 'check' && !store) {
            checkForStore()
            console.log('ran')
        }

        //eslint-disable-next-line
    }, [id])
    return (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '640px', margin: '0 auto', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
            <div style={{ margin: '1.5rem auto', width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {error && (<Message message={error} severity='error' />)}
            </div>

            {store ? (<div>
                <Typography variant='h6' align='center'>Your Application Status</Typography>
                <div style={{ padding: '3rem', boxShadow: '3px 5px 3px rgba(0,0,0,0.3', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '18rem', width: '22rem', alignItems: 'center', borderRadius: '1rem', marginTop: '1rem', backgroundColor: '#eee' }}>
                    <Typography style={{ marginBottom: '1rem' }} variant='h4'>
                        Status
                    </Typography>
                    <Typography className='capitalize' variant='h6'>{store.status}</Typography>
                    {store.status === 'approved' && !store.hasItems && (
                        <div style={{ padding: '1rem' }}>
                            <Typography variant='caption'>Congratulations!. Your store has been approved</Typography>
                            <Typography variant='subtitle2'>Please continue to complete your store profile</Typography>
                            <Controls.Button style={{ margin: '1rem' }} text="Complete Profile" color='secondary' onClick={() => history.replace(`/store/profile/${store.id}`)} />
                        </div>
                    )}
                </div>
            </div>) : (
                    <div>
                        <div>
                            <BackArrow />
                            <Typography align='center' variant='h5'>Application Status</Typography>
                        </div>

                        <Grid container>
                            <Form >
                                <Grid item xs={12}>

                                    <Controls.Input label="Store Phone Number" onKeyUp={e => { if (e.target.value.length === 10) { zipRef.current.focus() } }} onBlur={e => setPhone(phoneFormatted(e.target.value))} value={phone} onChange={e => setPhone(e.target.value)} />
                                    <Controls.Input inputRef={zipRef} label="Store Zip Code" inputProps={{ maxLength: 5, minLength: 5 }} value={zipcode} onChange={e => setZipcode(e.target.value)} />


                                </Grid>
                                <Grid>
                                    <Controls.Button text='Check Status' onClick={checkStatus} />
                                    <Controls.Button color='secondary' text='Clear' onClick={clearForm} />

                                </Grid>
                            </Form>
                        </Grid>
                    </div>
                )}

        </div>
    )
}

export default ApplicationStatus
