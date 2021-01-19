import { Grid, TextField, Typography, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Controls from "../../../components/controls/Controls";
import CategoryScrollItem from "../../../components/Items/CategoryScrollItem";
import Loader from "../../../components/Loader";

const AllCategories = () => {
  const { categories, loading, current } = useSelector(
    (state) => state.categoriesData
  );
  const [category, setCategory] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addCategory = () => {
    if (category === "") {
      setError(true);
      setErrorMessage("category is required");
    }
  };

  useEffect(() => {}, [current]);

  if (loading) return <Loader />;
  return (
    <div
      style={{
        display: "flex",
        margin: "1rem auto",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "1280px",
        height: "100%",
      }}
    >
      <Grid container alignContent="center">
        <Grid item xs={12}>
          <Typography align="center" variant="h5">
            All Categories
          </Typography>
        </Grid>
        <Grid item container style={{ width: "80vw", margin: "1rem auto" }}>
          <TextField
            label="Category Name"
            value={category}
            variant="outlined"
            fullWidth
            error={error}
            helperText={errorMessage}
            onChange={(text) => setCategory(text.target.value)}
          />
          <Typography>{category}</Typography>
          <Controls.Button
            style={{ margin: "1rem 0" }}
            text="Add Category"
            onClick={addCategory}
          />
        </Grid>
        <Grid item container alignItems="center" style={{ maxWidth: "1080px" }}>
          {categories.length > 0 ? (
            categories
              .sort((a, b) => (a.name < b.name ? -1 : 1))
              .map((cat) => <CategoryScrollItem key={cat.id} name={cat.name} />)
          ) : (
            <Grid item>
              <Typography variant="h6">No Categories</Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AllCategories;
