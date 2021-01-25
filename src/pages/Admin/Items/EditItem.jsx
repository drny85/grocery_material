import { Grid } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Controls from '../../../components/controls/Controls'
import Loader from '../../../components/Loader'
import { Form, useForm } from '../../../components/useForm'
import { clearCurrentItem, setCurrentItem } from '../../../reduxStore/actions/itemsActions'


const initialValues = {

}

const EditItem = () => {

    const { id } = useParams()
    const { current, loading } = useSelector(state => state.itemsData)
    const { store } = useSelector(state => state.userData)
    const dispatch = useDispatch()

    const validate = () => {

    }

    const { setValues, handleInputChange, errors, values } = useForm(initialValues, true, validate)

    useEffect(() => {
        !current && dispatch(setCurrentItem(id, store?.id))


        return () => {
            dispatch(clearCurrentItem())
        }
        //eslint-disable-next-line
    }, [id, dispatch, store?.id])

    useEffect(() => {
        if (current) {
            setValues(current)
        }
    }, [current])

    console.log(values)
    console.log(current)
    if (loading) return <Loader />
    return (
        <div style={{ display: 'flex', maxWidth: '1280px', padding: '1rem auto', width: '100%', flexDirection: 'column', justifyContent: 'center', margin: '2rem auto' }}>
            <Form>
                <Grid container>
                    <Grid item xs={12}>
                        <Controls.Input name='name' label='Item Name' value={values.name} onChange={handleInputChange} />
                    </Grid>
                </Grid>
            </Form>
        </div>
    )
}

export default EditItem
