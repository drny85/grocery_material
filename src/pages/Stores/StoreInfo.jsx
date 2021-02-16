import { Grid, Paper, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BackArrow from '../../components/BackArrow'
import Loader from '../../components/Loader'
import { getStoreDetails } from '../../reduxStore/actions/storeActions'

const StoreInfo = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { current, loading } = useSelector(state => state.storesData)

    useEffect(() => {

        !current && dispatch(getStoreDetails(id))

        return () => {

        }

    }, [id, dispatch, current])

    if (!current || loading) <Loader />

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1080px', margin: '1rem auto' }}>
                <BackArrow />
                <Typography variant='h5'>Store Info</Typography>
                <Typography></Typography>
            </div>
            <div className="content_info">
                <Grid container>
                    <Grid item xs={12}>
                        <Paper style={{ margin: '1rem', padding: '1rem' }}>
                            <Typography className='capitalize'>Name: {current?.name}</Typography>
                            <Typography className='capitalize'>Address: {current?.street} {current?.city} {current?.state}, {current?.zipcode}</Typography>
                            <Typography>Name: {current?.name}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default StoreInfo
