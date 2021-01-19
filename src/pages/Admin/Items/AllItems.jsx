import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterCategoriesBy } from "../../../reduxStore/actions/itemsActions";

import Loader from "../../../components/Loader";
import CardItem from "../../../components/Items/CardItem";
import { Grid } from "@material-ui/core";

import "./styles.css";
import CategoryScrollItem from "../../../components/Items/CategoryScrollItem";
import { useParams } from "react-router-dom";

const AllItems = ({ history }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { items, loading, filtered } = useSelector((state) => state.itemsData);
  const { categories } = useSelector((state) => state.categoriesData);

  const filterItemsByCategory = (categoryId) => {
    dispatch(filterCategoriesBy(categoryId));
    history.push(`/admin/allItems/${categoryId}`);
  };

  useEffect(() => {
    return () => {};
  }, [id, history, dispatch]);

  console.log(
    categories.forEach((cat) =>
      items.forEach((item) => item.category === cat.id)
    )
  );

  if (loading) return <Loader />;
  return (
    <div className="main" style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div
        className="horizontal-scroll-wrapper"
        style={{
          display: "flex",
          overflowX: "auto",
          maxWidth: "1280px",
          width: "100%",
          height: "100px",
          maxHeight: "100px",
          padding: "1rem",
        }}
      >
        {categories
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((i) => (
            <CategoryScrollItem
              key={i.id}
              name={i.name}
              selected={id}
              onClick={() => filterItemsByCategory(i.id)}
            />
          ))}
      </div>
      <Grid container alignItems="center" justify="center">
        {filtered.length > 0 ? (
          filtered.length > 0 ? (
            filtered.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                <CardItem item={item} />
              </Grid>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                margin: "0 auto",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
              }}
            >
              <h3>No Products</h3>
            </div>
          )
        ) : items.length > 0 ? (
          items.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
              <CardItem item={item} />
            </Grid>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              margin: "0 auto",
              justifyContent: "center",
              alignItems: "center",
              width: "100vw",
              height: "100vh",
            }}
          >
            <h3>No Products</h3>
          </div>
        )}
      </Grid>
    </div>
  );
};

export default AllItems;
