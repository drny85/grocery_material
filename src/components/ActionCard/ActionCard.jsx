import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        height: '25%',
        width: '25%',
        marginBottom: '1rem',
        marginRight: '1rem',
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.spacing(2)
    },

    title: {
        fontSize: '2rem',
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        textAlign: 'center'

    },
    pos: {
        marginBottom: 12,
    },
}));


const ActionCard = ({ title, onClick }) => {
    const classes = useStyles();
    return (
        <Card onClick={onClick} className={classes.root}>
            <CardContent>
                <Typography className={classes.title} variant='h4'>{title}</Typography>
            </CardContent>
        </Card>
    )
}

export default ActionCard
