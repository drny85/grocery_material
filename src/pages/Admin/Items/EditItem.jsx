import { FormControlLabel, Grid, Typography, Switch, Checkbox } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BackArrow from '../../../components/BackArrow'
import Controls from '../../../components/controls/Controls'
import Loader from '../../../components/Loader'
import { Form, useForm } from '../../../components/useForm'
import { storage } from '../../../database'
import { updateItem } from '../../../reduxStore/actions/itemsActions'

import { SIZES } from '../../../utils/constants'

import './styles.css'

const initialValues = {
    name: "",
    description: "",
    category: '',
    price: "",
    unitSold: 0,
    available: true,
    imageUrl: '',
    storeId: '',
    quantity: 1,
};



const EditItem = ({ history }) => {

    const { id } = useParams()
    const priceRef = useRef()
    const [item, setItem] = useState(null)
    const { items, loading } = useSelector(state => state.itemsData)
    const { categories } = useSelector(state => state.categoriesData)

    const [comeInSizes, setComeInSizes] = useState(false)
    const [image, setImage] = useState('')
    const [sizes, setSizes] = useState([])
    const [price, setPrice] = useState({})
    const imgRef = useRef()

    const dispatch = useDispatch()

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("name" in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required.";
        if ("description" in fieldValues)
            temp.description =
                fieldValues.description.length > 10
                    ? ""
                    : "Minimum 10 characters required.";
        // if ("price" in fieldValues)
        //   temp.price = fieldValues.price.length !== 0 ? "" : "Price is required";
        if ("category" in fieldValues)
            temp.category =
                fieldValues.category.length !== 0 ? "" : "This field is required";
        if ("imageUrl" in fieldValues)
            temp.imageUrl =
                fieldValues.imageUrl.length !== 0 ? "" : "An Image is required";


        setErrors({
            ...temp,
        });


        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };


    const { setValues, handleInputChange, setErrors, errors, values } = useForm(initialValues, true, validate)

    const handleUpdateItem = async e => {
        e.preventDefault()
        if (comeInSizes && sizes.length === 0) {
            alert('You must select a price for each size')
            return
        }
        if (!comeInSizes && values.price === '') {
            alert('You must enter a price')
            priceRef.current.focus()
            return
        }

        values.imageUrl = image === '' ? values.imageUrl : image;
        values.price = comeInSizes ? price : parseFloat(values.price);
        values.sizes = comeInSizes ? sizes : null;
        if (validate()) {

            const updated = await dispatch(updateItem(values))

            if (updated) {
                history.goBack()
            } else {
                return
            }
        }
    }

    const handleImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];
            if (image.type.includes('image')) {

                //valid image
                const task = storage.ref(`/images/${image.name}`).put(image)
                task.on('state_changed', (snapShop) => {

                }, (err) => {
                    console.log(err)
                }, () => {
                    storage.ref('images').child(image.name).getDownloadURL().then(url => {

                        imgRef.current.style.backgroundImage = `url(${url})`
                        setImage(url)
                        values.imageUrl = url
                    })
                })

            } else {
                console.error('NO')
            }
        }


    }

    const handleSizes = e => {

        let value = e.target.value;

        const index = sizes.indexOf(value)
        if (index > -1) {
            const sc = [...sizes]
            sc.splice(index, 1)
            setSizes(sc)
            delete price[value]
            setPrice({ ...price })
        } else {
            setSizes([...sizes, value])
        }

    }

    const handlePrices = (e) => {
        let value = e.target.value;
        setPrice({ ...price, [e.target.name]: value })
    }


    useEffect(() => {

        const i = items.find(a => a.id === id)
        setItem(i)
        setValues(i)
        if (item) {
            imgRef.current.style.backgroundImage = `url(${values.imageUrl})`
            setComeInSizes(i.sizes !== null)
            if (item.sizes !== null) {
                setSizes([...item.sizes])
                setPrice({ ...item.price })
            }
        }

        return () => {

        }
        //eslint-disable-next-line
    }, [id, items.length, item])

    if (loading || !item) return <Loader />
    return (
        <div style={{
            display: "flex",
            maxWidth: "1080px",
            flexDirection: "column",
            margin: "3rem auto",
            width: "100%",
            boxShadow: "4px 6px 4px 2px rgba(0,0,0,0.4)",
        }}>
            <div className="top-titles">
                <BackArrow />
                <Typography align="center" variant="h4">
                    Update Item
      </Typography>
            </div>
            <div style={{ margin: "1.5rem 2rem" }}>
                <Form onSubmit={handleUpdateItem}>
                    <Grid container>
                        <Grid item xs={12} sm={7}>
                            <Grid container item>


                                <Controls.Input name='name' label='Item Name' value={values?.name} onChange={handleInputChange} />
                                <Controls.Input name='description' label="Item Description" value={values?.description} onChange={handleInputChange} />
                                <Controls.Select name='category' error={errors?.category} label='Select a Category' value={values?.category} onChange={handleInputChange} options={categories.sort((a, b) => (a.name < b.name ? -1 : 1))} />
                                <Controls.Input error={errors.imageUrl} type='file' value='' onChange={handleImage} />
                            </Grid>
                            <Grid container item>
                                <Grid item>
                                    <FormControlLabel
                                        control={<Switch checked={comeInSizes} onChange={() => setComeInSizes(!comeInSizes)} name="sizes" />}
                                        label="Does this item come in sizes?"
                                    />
                                </Grid>

                            </Grid>
                            {comeInSizes && (
                                <Grid item>
                                    {comeInSizes && (SIZES.map((size, i) => (<FormControlLabel className='capitalize' style={{ paddingLeft: '1rem' }} key={i.toString()}
                                        control={<Checkbox key={size} checked={sizes.includes(size)} onChange={handleSizes} value={size} name={size} />}
                                        label={size}
                                    />)))}

                                </Grid>
                            )}

                            {comeInSizes && (
                                <Grid item>
                                    {sizes.length > 0 && (
                                        sizes.map(s => <Controls.Input focus={true} className='capitalize' value={price[s]} label={s} name={s} key={s} onChange={handlePrices} />)
                                    )}
                                </Grid>
                            )}
                            {!comeInSizes && item && (
                                <Grid item>
                                    <Controls.Input name='price' inputRef={priceRef} label='Item Price' focus={true} inputProps={{ min: 0, step: 0.01 }} type='number' value={values.price} error={errors.price} onChange={handleInputChange} />
                                </Grid>
                            )}

                            <Grid container item>
                                <Grid item>
                                    <Controls.Button text='Update Item' type='submit' />
                                </Grid>

                            </Grid>
                        </Grid>
                        {item && (
                            <Grid item xs={12} sm={5}>
                                <div className="preview">
                                    <div ref={imgRef} className="preview_img">
                                        {/* <img r src={image ? image : 'https://billfish.org/wp-content/uploads/2019/08/placeholder-image.jpg'} alt="" /> */}

                                    </div>
                                    <div className="preview_details">
                                        <div className="preview_details_title">
                                            <Typography className='capitalize' variant='h5'>{values.name}</Typography>
                                            <Typography noWrap variant='caption'>{values.description}</Typography>

                                        </div>
                                        <div className="previews_details_bottom">
                                            {item && item.sizes === null && !comeInSizes && (<Typography variant='h5'>{values.price && '$'}{values.price}</Typography>)}
                                            <div className="pricing" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>

                                                {item && comeInSizes && (sizes.map(p => (<Typography className='capitalize' key={p}>{p} : ${price[p]}</Typography>)))}
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        )}

                    </Grid>
                </Form>
            </div>
        </div>
    )
}

export default EditItem
