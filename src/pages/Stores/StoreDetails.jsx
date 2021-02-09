import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Select, Typography, makeStyles, FormControl, InputLabel, MenuItem } from '@material-ui/core'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BackArrow from '../../components/BackArrow'
import Controls from '../../components/controls/Controls'
import moment from 'moment'
import Loader from '../../components/Loader'
import { clearCurrentStore, getStoreDetails, updateStoreApplicationStatus } from '../../reduxStore/actions/storeActions'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: '90%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const StoreDetails = () => {
    const { id } = useParams()
    const classes = useStyles()
    const { current } = useSelector(state => state.storesData)
    const [show, setShow] = useState(false)
    const [status, setStatus] = useState('')
    const dispatch = useDispatch()

    const changeApplicationStatus = async () => {
        if (status === '') {
            return
        }
        const u = { ...current }
        if (status === 'approved') {
            u.approvedOn = new Date().toISOString()
        }
        u.updatedOn = new Date().toISOString()
        u.status = status
        u.userId = current?.userId
        const updated = await dispatch(updateStoreApplicationStatus(u))
        if (updated) {
            setShow(false)
            setStatus('')
        }
    }

    const handleChange = (e) => {
        setStatus(e.target.value)
    }

    useEffect(() => {
        dispatch(getStoreDetails(id))
        if (current) {
            setStatus(current.status)
        }
        return () => {
            dispatch(clearCurrentStore())
        }

        //eslint-disable-next-line
    }, [id, dispatch])

    if (!current) return <Loader />
    return (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1080px', width: '100vw', margin: '1rem auto', justifyContent: 'center', padding: '0.5rem' }}>
            <div>
                <BackArrow />
                <Typography variant='h6' align='center'>Store Details</Typography>
            </div>
            <Grid container>
                <Grid item xs={12}>
                    <Paper style={{ padding: '1rem' }}>
                        <Typography className='capitalize' variant='h4' align='center'>{current.name}</Typography>
                        <Grid item xs={12}>
                            <Typography style={{ padding: '0.5rem 0rem', textTransform: 'capitalize' }}>Address: {current.street}, {current.city} {current.state} {current.zipcode}</Typography>

                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ padding: '0.5rem 0rem' }}>Store Phone: {current.phone}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ padding: '0.5rem 0rem' }}>Owner's Phone: {current.ownerPhone && current.ownerPhone}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography style={{ padding: '0.5rem 0rem' }}>Store Phone: {current.phone}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ padding: '0.5rem 0rem' }}>Email Address: {current.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ padding: '0.5rem 0rem' }}>Application Status: {current.status}</Typography>
                        </Grid>
                        {current.appliedOn && (
                            <Grid item xs={12}>
                                <Typography style={{ padding: '0.5rem 0rem' }}>Applied On: {moment(current.appliedOn && current.appliedOn).format('LLL')}</Typography>
                            </Grid>
                        )}
                        {current.approvedOn && (
                            <Grid item xs={12}>
                                <Typography style={{ padding: '0.5rem 0rem' }}>Applied On: {moment(current.approvedOn).format('LLL')}</Typography>
                            </Grid>
                        )}

                        <Grid item style={{ margin: '1rem 0' }}>
                            <Controls.Button text='Change Status' onClick={() => {
                                setStatus(current.status)
                                setShow(true)
                            }} />
                        </Grid>

                    </Paper>

                </Grid>
            </Grid>
            <Dialog open={show}>
                <DialogTitle>Change Status</DialogTitle>
                <DialogContent style={{ width: '25rem', height: '15rem' }}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            onChange={handleChange}
                        >
                            <MenuItem value={'pending'}>Pending</MenuItem>
                            <MenuItem value={'processing'}>Processing</MenuItem>
                            <MenuItem value={'approved'}>Approved</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Controls.Button color='secondary' text='Cancel' onClick={() => setShow(false)} />
                    <Controls.Button text='Update' onClick={changeApplicationStatus} />
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default StoreDetails
