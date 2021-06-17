import { ButtonGroup, Typography, Button } from '@material-ui/core'
import React from 'react'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import './styles.css'


const OrderItem = ({ item, editMode = false, onPressAdd, onPressRemove }) => {

    return (
        <div className='order_item'>
            <div style={{ backgroundImage: `url(${item.imageUrl})` }} className="img">

            </div>
            <div className="details">
                <div className="name">
                    <Typography style={{ textTransform: 'capitalize' }} variant='body2'> {item.quantity} {item.name} {item.size && `, ${item.size}`}</Typography>
                    {item.instruction && (<i style={{ fontSize: '0.8rem', color: 'gray' }}>{item.instruction}</i>)}
                </div>
                <div className="price">
                    ${item.price.toFixed(2)}
                </div>
                <div className="total">
                    <Typography variant='h6'> ${(item.price * item.quantity).toFixed(2)}</Typography>
                </div>
            </div>
            <div>
                {editMode && (
                    <div className='edit-mode' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', marginRight: 10 }}>
                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                            <Button onClick={onPressRemove}>
                                <RemoveIcon />
                            </Button>
                            <Button onClick={onPressAdd}>
                                <AddIcon />
                            </Button>
                        </ButtonGroup>
                    </div>
                )}

            </div>


        </div>
    )
}

export default OrderItem
