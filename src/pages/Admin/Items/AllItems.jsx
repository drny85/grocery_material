import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearItemsFilters, filterCategoriesBy } from "../../../reduxStore/actions/itemsActions";

import Loader from "../../../components/Loader";
import CardItem from "../../../components/Items/CardItem";
import { Grid, Typography } from "@material-ui/core";

import "./styles.css";
import CategoryScrollItem from "../../../components/Items/CategoryScrollItem";
import { useParams } from "react-router-dom";
import BackArrow from "../../../components/BackArrow";

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
    return () => {
      dispatch(clearItemsFilters())
    };
  }, [history, dispatch]);


  if (loading) return <Loader />;
  return (
    <div className="main" style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div className="back_arroe" style={{ display: 'flex', margin: '1rem 1.5rem', justifyContent: 'space-between' }}>
        <BackArrow onClick={() => history.replace('/')} />
        <Typography variant='h5'>All Items / Products</Typography>
        <Typography></Typography>
      </div>
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
        <CategoryScrollItem name='All Categories' key='all' id='all' selected={id} onClick={() => {
          history.push('/admin/allItems/all')
          dispatch(clearItemsFilters())
        }} />
        {categories
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((i) => (
            <CategoryScrollItem
              key={i.id}
              name={i.name}
              id={i.id}
              selected={id}
              onClick={() => filterItemsByCategory(i.id)}
            />
          ))}
      </div>
      <Grid container alignItems="center" justify="center">

        {!filtered ? items.map((item) => (
          <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
            <CardItem item={item} onClick={() => history.push(`/item/${item.id}`)} />
          </Grid>
        )) : filtered.length === 0 ? (<div
          style={{
            display: "flex",
            margin: "0 auto",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "60vh",
          }}
        >
          <h3>No Products</h3>
        </div>) : filtered.map(item =>
          <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
            <CardItem item={item} />
          </Grid>)}

      </Grid>
    </div>
  );
};

export default AllItems;
