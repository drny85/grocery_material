import { TextField } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { clearOrderFilter, filterOrders } from '../reduxStore/actions/ordersActions';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
        borderRadius: '30px',
        textAlign: 'center',
        border: 'none'

    },
}));

const SearchBar = () => {

    const classes = useStyles();
    const dispatch = useDispatch()

    const onChange = e => {
        let value = e.target.value;
        if (value !== '') {
            dispatch(filterOrders(value))
        } else {
            dispatch(clearOrderFilter())
        }

    }


    return (
        <TextField variant='outlined' fullWidth className={classes.margin} onChange={onChange} label='Search order by number, customer name, customer last name or phone number.' />

    )
}

export default SearchBar
