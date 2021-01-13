import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const Loader = () => {
    const theme = useTheme()
    const classes = useStyles();
    return <Backdrop className={classes.backdrop} open={true} >
        <CircularProgress color='primary' />
    </Backdrop>
}


export default Loader;