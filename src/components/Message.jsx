import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const Message = ({ message, severity }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Alert variant='filled' severity={severity} iconMapping={{ success: <CheckCircleOutlineIcon fontSize="inherit" />, error: <ErrorOutlineIcon fontSize='inherit' /> }}>
                {message}
            </Alert>
        </div>
    )
}

export default Message
