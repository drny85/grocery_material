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


const SIZES = [
  { size: "small" },
  { size: "medium" },
  { size: "large" },
  { size: "extra large" },
];


const initialValues = {
  name: "",
  description: "",
  category: '',
  price: "",
  unitsold: 0,
  available: true,
  imageUrl: '',
  storeId: '',
  quantity: 1,
};

const AddItem = () => {
  const { categories } = useSelector(state => state.categoriesData)
  const { user } = useSelector(state => state.userData)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const imgRef = useRef()
  const priceRef = useRef()
  const [selectedSizes, setSelectedSizes] = useState({});
  const [comeInSizes, setComeInSizes] = useState(false)
  const [image, setImage] = useState('')
  const [sizes, setSizes] = useState(null)

  const handlePriceBySizes = (event) => {

    setSelectedSizes({ ...selectedSizes, [event.target.name]: parseFloat(event.target.value) })


  };

  const handleSizes = e => {

    setSizes({ ...sizes, [e.target.name]: e.target.checked })

  }


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
    if ("estimatedDelivery" in fieldValues)
      temp.estimatedDelivery =
        fieldValues.estimatedDelivery.length !== 0
          ? ""
          : "Estimated delivery is required";

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
    imgRef.current.style.backgroundImage = null;
    setComeInSizes(false)
    setSizes(null)
    setSelectedSizes({})
    resetForm()

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comeInSizes && values.price === '') {

      showMessage('Item price is missing', 'error')
      priceRef.current.focus()


      return

    }

    //verified that all sizes selcted have prices assigned
    if (comeInSizes && sizes) {
      const sl = Object.keys(sizes).length
      const pl = Object.keys(selectedSizes).length;

      if (sl !== pl) {
        showMessage('All sizes must have a price', 'error')
        return
      }
    } else if (comeInSizes && sizes === null) {
      showMessage('All sizes must have a price', 'error')
      return
    }

    if (validate()) {

      values.sizes = comeInSizes ? Object.keys(selectedSizes) : null
      values.price = comeInSizes ? selectedSizes : parseFloat(values.price);
      values.addedOn = new Date().toISOString();

      const submitted = dispatch(addItem(values));
      if (submitted) {
        resetEverything()
        showMessage('Item has been added', 'success')
      } else {
        alert('Error adding item')
      }


    } else {
      console.log('not valid')
    }

  };

  const showMessage = (message, severity) => {
    setError({ message, severity })

    setTimeout(() => {
      setError(null)
    }, 4000)
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




  };


  useEffect(() => {
    dispatch(getCategories(user?.userId))

  }, [dispatch, user, image])
  return (
    <div
      style={{
        display: "flex",
        maxWidth: "1080px",
        flexDirection: "column",
        margin: "1rem auto",
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
      {error && (<Message message={error?.message} severity={error?.severity} />)}

      <div style={{ margin: "1rem 2rem" }}>
        <Form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={12} sm={7}>
              <Controls.Input
                name="name"
                error={errors.name}
                value={values.name}
                label="Item name"
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
              <Controls.Input error={errors.imageUrl} type='file' onChange={handleImage} />

              <Grid item container>
                <Grid item>
                  <FormControlLabel
                    control={<Switch checked={comeInSizes} onChange={() => setComeInSizes(!comeInSizes)} name="sizes" />}
                    label="Does this item come in sizes?"
                  />

                </Grid>
                <Grid item>
                  {comeInSizes && (SIZES.map((size, i) => (<FormControlLabel style={{ paddingLeft: '1rem' }} key={i.toString()}
                    control={<Checkbox key={size} checked={size[size.size]} onChange={handleSizes} value={selectedSizes[size.size]} name={size.size} />}
                    label={size.size}
                  />)))}

                </Grid>
                <Grid item>
                  {comeInSizes && sizes && (Object.entries(sizes).filter(size => size[1] === true).map((a, i) => (
                    <>

                      <Controls.Input className='capitalize' key={i.toString()} name={a[0]} label={a[0]} onChange={handlePriceBySizes} />
                    </>
                  )))}
                </Grid>

              </Grid>
              {!comeInSizes && (
                <Grid item>
                  <Controls.Input inputRef={priceRef} name='price' label='Item Price' inputProps={{ min: 0, step: 0.01 }} type='number' values={values.price} error={errors.price} onChange={handleInputChange} />
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
                    <Typography variant='h5'>{values.price && '$'}{values.price}</Typography>
                    {selectedSizes && (Object.entries(selectedSizes).map(s => ({ size: s[0], price: s[1] })).sort((a, b) => (a.price < b.price)).map(size => <Typography className='capitalize' key={size.size}>{size.size}: ${size.price}</Typography>))}
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
