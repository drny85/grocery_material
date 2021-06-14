import { FormControlLabel, Grid, Typography, Switch, Checkbox } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Controls from "../../../components/controls/Controls";
import { Form, useForm } from "../../../components/useForm";
import { getCategories } from "../../../reduxStore/actions/categoriesActions";
import BackArrow from '../../../components/BackArrow'
import { storage } from "../../../database";
import { addItem } from "../../../reduxStore/actions/itemsActions";
import Message from "../../../components/Message";
import { SIZES } from '../../../utils/constants'

import AllCategories from "../Categories/AllCategories";

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

const AddItem = () => {
  const { categories, loading } = useSelector(state => state.categoriesData)
  const { user } = useSelector(state => state.userData)
  const { error } = useSelector(state => state.itemsData)
  const [localError, setError] = useState(null)
  const dispatch = useDispatch()
  const imgRef = useRef()
  const inputImgRef = useRef()
  const priceRef = useRef()
  const [price, setPrice] = useState(null)
  const [comeInSizes, setComeInSizes] = useState(false)
  const [image, setImage] = useState('')
  const [sizes, setSizes] = useState([])

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
        fieldValues.category.length !== 0 ? "" : "A category is required";
    if ("imageUrl" in fieldValues)
      temp.imageUrl =
        fieldValues.imageUrl.length !== 0 ? "" : "An Image is required";
    if ("estimatedDelivery" in fieldValues)
      temp.estimatedDelivery =
        fieldValues.estimatedDelivery.length !== 0
          ? ""
          : "Estimated delivery is required";

    if (values.imageUrl === '' && image !== '') {
      values.imageUrl = image
    }

    setErrors({
      ...temp,
    });


    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const {
    setErrors,
    values,
    errors,
    resetForm,

    handleInputChange,
  } = useForm(initialValues, true, validate);

  const resetEverything = () => {

    setImage('')
    inputImgRef.current.value = null;
    imgRef.current.style.backgroundImage = null;
    setPrice(null)
    setSizes([])

    resetForm()

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (comeInSizes && sizes.length > 0) {
        const sl = sizes.length
        const pl = Object.keys(price).length;

        if (sl !== pl) {
          showMessage('All sizes must have a price', 'error')
          return
        }
      } else if (comeInSizes && sizes === null) {
        showMessage('All sizes must have a price', 'error')
        return
      }

      if (comeInSizes && price === null) {
        showMessage("You need a price for this item")
        return;
      }

      if (validate()) {
        if (!comeInSizes && values.price === '') {

          showMessage('Item price is missing', 'error')
          priceRef.current.focus()


          return

        }

        values.sizes = comeInSizes ? sizes : null
        values.price = comeInSizes ? price : parseFloat(values.price);
        values.addedOn = new Date().toISOString();

        console.log(values)
        const submitted = await dispatch(addItem(values));
        if (submitted) {

          resetEverything()
          showMessage('Item has been added', 'success')
        } else {
          if (error) {
            showMessage(error, 'error')
          }

        }


      } else {
        console.log('not valid')
        console.log(values)

      }

    } catch (error) {
      console.log('Error @adding Item', error)
    }
    //verified that all sizes selcted have prices assigned

  };

  const showMessage = (message, severity) => {
    setError({ message, severity })

    setTimeout(() => {
      setError(null)
    }, 4000)
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

  console.log(sizes, price)

  const handlePrices = (e) => {
    let value = e.target.value;
    setPrice({ ...price, [e.target.name]: parseFloat(value) })
  }

  const handleImage = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type.includes('image')) {

        //valid image
        const task = storage.ref(`/images/${user.store}/${image.name}`).put(image)
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




  };

  useEffect(() => {
    dispatch(getCategories(user?.userId))

  }, [dispatch, user, image])


  if (categories.length === 0 && !loading) {
    return <AllCategories />
  }
  return (
    <div
      style={{
        display: "flex",
        maxWidth: "1080px",
        flexDirection: "column",
        margin: "3rem auto",
        width: "100%",
        boxShadow: "4px 6px 4px 2px rgba(0,0,0,0.4)",
      }}
    >
      <div className="top-titles">
        <BackArrow />
        <Typography align="center" variant="h4">
          Add Item
      </Typography>
      </div>
      {(error || localError) && (<Message message={localError.message} severity={error?.severity} />)}

      <div style={{ margin: "1.5rem 2rem" }}>
        <Form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={12} sm={7}>
              <Controls.Input
                name="name"
                error={errors.name}
                value={values.name}
                inputProps={{ style: { textTransform: 'capitalize' } }}
                label="Item Name"
                onChange={handleInputChange}
              />
              <Controls.Input
                multiline
                name="description"
                value={values.description}
                error={errors.description}
                label="Item Description"
                onChange={handleInputChange}
              />

              <Controls.Select name='category' error={errors.category} label='Select a Category' value={values.category} onChange={handleInputChange} options={categories.sort((a, b) => (a.name < b.name ? -1 : 1))} />
              <Controls.Input inputRef={inputImgRef} error={errors.imageUrl} type='file' onChange={handleImage} />

              <Grid item container>
                <Grid item>
                  <FormControlLabel
                    control={<Switch checked={comeInSizes} onChange={() => setComeInSizes(!comeInSizes)} name="sizes" />}
                    label="Does this item come in sizes?"
                  />

                </Grid>
                <Grid item>
                  {comeInSizes && (SIZES.map((size, i) => (<FormControlLabel style={{ paddingLeft: '1rem' }} className='capitalize' key={i.toString()}
                    control={<Checkbox key={size} checked={sizes.includes(size)} onChange={handleSizes} value={size} name={size} />}
                    label={size}
                  />)))}

                </Grid>
                <Grid item>
                  {comeInSizes && sizes.length > 0 && sizes.sort((a, b) => (a < b ? 1 : -1)).map(s => (<Controls.Input className='capitalize' key={s} name={s} label={s} onChange={handlePrices} />))

                  }
                </Grid>

              </Grid>
              {!comeInSizes && (
                <Grid item>
                  <Controls.Input inputRef={priceRef} name='price' label='Item Price' inputProps={{ min: 0, step: 0.01 }} type='number' value={values.price} error={errors.price} onChange={handleInputChange} />
                </Grid>
              )}

            </Grid>
            <Grid item xs={12} sm={5}>
              <div className="preview">
                <div ref={imgRef} className="preview_img">
                  {/* <img r src={image ? image : 'https://billfish.org/wp-content/uploads/2019/08/placeholder-image.jpg'} alt="" /> */}
                  {values.name === '' && values.imageUrl === '' && (<h3>Item Preview</h3>)}
                </div>
                <div className="preview_details">
                  <div className="preview_details_title">
                    <Typography className='capitalize' variant='h5'>{values.name}</Typography>
                    <Typography noWrap variant='caption'>{values.description}</Typography>

                  </div>
                  <div className="previews_details_bottom">
                    {!comeInSizes && <Typography variant='h5'>{values.price && '$'}{values.price}</Typography>}
                    <div className="pricing" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>

                      {comeInSizes && sizes.length > 0 && price && (sizes.map(p => (<Typography className='capitalize' key={p}>{p} : ${price[p]}</Typography>)))}
                    </div>

                  </div>
                </div>
              </div>

            </Grid>
          </Grid>
          <Grid>
            <Controls.Button text="Add Item" type='submit' />
            <Controls.Button
              text="Reset Form"
              color="secondary"
              onClick={resetForm}
            />
          </Grid>
        </Form>
      </div>
    </div>
  );
};

export default AddItem;
