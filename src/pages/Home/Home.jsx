import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ActionCard from '../../components/ActionCard/ActionCard'

import { makeStyles } from '@material-ui/core/styles';

//import Button from '@material-ui/core/Button';
//import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {

        backgroundColor: theme.palette.background.paper,
        width: '100vw',
        height: '100vh',
        maxWidth: '1800px',
        maxWwidth: '2680px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        overflow: 'hidden',
        margin: '1rem',


    },

    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));



const Home = () => {
    const { user } = useSelector(state => state.userData)
    const classes = useStyles()
    const history = useHistory()

    if (!user) history.replace('/signin')
    return (
        <div className={classes.root}>

            <ActionCard title='Orders' onClick={() => { history.push('/orders') }} />
            <ActionCard title='Admin' onClick={() => { history.push('/admin') }} />
            <ActionCard title='Home' onClick={() => { }} />
            <ActionCard title='Home' onClick={() => { }} />
            <ActionCard title='Home' onClick={() => { }} />
            <ActionCard title='Home' onClick={() => { }} />


        </div>
    )
}

export default Home
