import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Controls from "../../../components/controls/Controls";
import { Form, useForm } from "../../../components/useForm";

const initialValues = {
  name: "",
  description: "",
  size: "",
  price: "",
};

const AddItem = () => {
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ("description" in fieldValues)
      temp.description =
        fieldValues.description.length > 10
          ? ""
          : "Minimum 10 characters required.";
    if ("price" in fieldValues)
      temp.price = fieldValues.price.length !== 0 ? "" : "Price is required";
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
    setValues,
    values,
    errors,
    resetForm,

    handleInputChange,
  } = useForm(initialValues, true, validate);

  const handleSubmit = () => {
    validate();
  };
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
            <Grid item xs={12}>
              <Controls.Input
                name="name"
                error={errors.name}
                value={values.name}
                label="Item name"
                onChange={handleInputChange}
              />
              <Controls.Input
                name="description"
                value={values.description}
                error={errors.description}
                label="Item Description"
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid>
            <Controls.Button text="Add Item" onClick={handleSubmit} />
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
