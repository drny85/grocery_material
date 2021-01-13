import { Typography } from '@material-ui/core'
import React from 'react'

import './styles.css'


const OrderItem = ({ item }) => {

    return (
        <div className='order_item'>
            <div style={{ backgroundImage: `url(${item.imageUrl})` }} className="img">

            </div>
            <div className="details">
                <div className="name">
                    <Typography style={{ textTransform: 'capitalize' }} variant='body2'> {item.quantity} {item.name} {item.size && `, ${item.size}`}</Typography>
                    {item.instruction && (<i style={{ fontSize: '0.7rem', color: 'gray' }}>{item.instruction}</i>)}
                </div>
                <div className="price">
                    ${item.price.toFixed(2)}
                </div>
                <div className="total">
                    <Typography variant='h6'> ${(item.price * item.quantity).toFixed(2)}</Typography>
                </div>

            </div>


        </div>
    )
}

export default OrderItem
