import { FormControlLabel, Grid, Typography, Switch, Checkbox } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Controls from "../../../components/controls/Controls";
import { Form, useForm } from "../../../components/useForm";
import { getCategories } from "../../../reduxStore/actions/categoriesActions";

import { storage } from "../../../database";
import { addItem } from "../../../reduxStore/actions/itemsActions";


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
  const dispatch = useDispatch()
  const imgRef = useRef()
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
    console.log(errors)

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
    resetForm()
    setImage('')
    imgRef.current.style.backgroundImage = null;
    setComeInSizes(false)
    setSizes(null)
    setSelectedSizes({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {

      values.sizes = comeInSizes ? Object.keys(selectedSizes) : null

      values.price = comeInSizes ? selectedSizes : parseFloat(values.price);
      console.log(values)
      const submitted = dispatch(addItem(values));
      if (submitted) {
        resetEverything()
      } else {
        alert('Error adding item')
      }


    } else {
      console.log('not valid')
    }

  };

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
      <Typography align="center" variant="h4">
        Add Item
      </Typography>
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

              <Controls.Select name='category' error={errors.category} label='Select a Category' value={values.category} onChange={handleInputChange} options={categories} />
              <Controls.Input error={errors.imageUrl} type='file' onChange={handleImage} />

              <Grid item container>
                <Grid item>
                  <FormControlLabel
                    control={<Switch checked={comeInSizes} onChange={() => setComeInSizes(!comeInSizes)} name="sizes" />}
                    label="Does this item come in sizes?"
                  />

                </Grid>
                <Grid item>
                  {comeInSizes && (SIZES.map(size => (<FormControlLabel style={{ paddingLeft: '1rem' }} key={size.size}
                    control={<Checkbox checked={size[size.size]} onChange={handleSizes} name={size.size} />}
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
                  <Controls.Input name='price' label='Item Price' inputProps={{ min: 0, step: 0.01 }} type='number' values={values.price} error={errors.price} onChange={handleInputChange} />
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
