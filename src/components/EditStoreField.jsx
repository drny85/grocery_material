import { Grid, InputAdornment, Paper, TextField, Typography } from '@material-ui/core'
import React from 'react'
import SendIcon from '@material-ui/icons/Send';

function EditStoreField({ title, store, submitUpdate, handleStoreUpdate, field, editing, setEditing, type }) {


    return (
        <Grid xs={12}>
            <Paper style={{ margin: '1rem', padding: '1rem', display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography>{title}: {store?.[field]}</Typography>


                    {editing && (<TextField style={{ maxWidth: '400px', width: '100%', marginLeft: '1rem' }} type={type ? type : 'text'} name={field} onChange={handleStoreUpdate} variant='outlined' value={store?.[field]} label='Estimated Delivery Time' InputProps={{
                        endAdornment: (<InputAdornment position='end'>
                            <SendIcon onClick={() => {
                                submitUpdate()
                                setEditing(false)
                            }} />
                        </InputAdornment>)
                    }} autoFocus />)}
                </div>

            </Paper>
        </Grid>
    )
}

export default EditStoreField
