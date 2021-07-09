import { Card, CardContent, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

const PaymentFailed = () => {
    const { orderId } = useParams()
    const history = useHistory()
    console.log(orderId)
    useEffect(() => {
        setTimeout(() => {
            history.replace(`/orders/${orderId}`)
        }, 2000)

    }, [orderId, history])
    return (

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, height: '100vh' }}>
            <Card style={{ height: '30vh', width: '30vw', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent>
                    <Typography variant='h5' align='center'>Payment Fail</Typography>
                </CardContent>
            </Card>

        </div>

    )
}

export default PaymentFailed
