import { Grid, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import Controls from '../../components/controls/Controls'
import { Form } from '../../components/useForm'
import { db } from '../../database'

const ApplicationStatus = () => {

    const [phone, setPhone] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [store, setStore] = useState(null)

    const checkStatus = async () => {

        await db.collection('stores').where('phone', '==', phone).where('zipcode', '==', zipcode).get().then(stores => {
            const store = []
            stores.forEach(s => {
                if (s.exists) {
                    store.push({ id: s.id, ...s.data() })
                }
            })
            setStore(store[0])
        })
            .catch(error => {
                console.log(error.message)
            })

    }


    console.log(store)
    const clearForm = () => {
        setPhone('')
        setZipcode('')

    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '640px', margin: '0 auto', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
            <Typography align='center' variant='h5'>Application Status</Typography>
            <Grid container>
                <Form >
                    <Grid item xs={12}>

                        <Controls.Input label="Store Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
                        <Controls.Input label="Store Zip Code" value={zipcode} onChange={e => setZipcode(e.target.value)} />


                    </Grid>
                    <Grid>
                        <Controls.Button text='Check Status' onClick={checkStatus} />
                        <Controls.Button color='secondary' text='Clear' onClick={clearForm} />

                    </Grid>
                </Form>
            </Grid>
        </div>
    )
}

export default ApplicationStatus
