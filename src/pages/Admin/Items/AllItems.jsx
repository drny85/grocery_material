import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../../reduxStore/actions/itemsActions";

import Loader from "../../../components/Loader";
import CardItem from "../../../components/Items/CardItem";
import { Grid } from "@material-ui/core";

import './styles.css'
import CategoryScrollItem from "../../../components/Items/CategoryScrollItem";
import { useParams } from "react-router-dom";
const AllItems = ({ match, history }) => {
  const dispatch = useDispatch();
  const { id } = useParams()
  const { items, loading, filtered } = useSelector((state) => state.itemsData);

  const filterItemsByCategory = (catId) => {

    history.push(`/admin/allItems/${catId}`)

  }

  useEffect(() => {

    return () => {
      //sub && sub()
    }
  }, [id, history]);

  if (loading) return <Loader />;
  return (
    <div className="main" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div className='horizontal-scroll-wrapper' style={{ display: 'flex', overflowX: 'auto', width: '100%', height: '100px', maxHeight: '100px', padding: '1rem' }}>
        {['1', '2', '3', '4', '5', '6'].map(i => <CategoryScrollItem key={i} name={i} selected={id} onClick={() => filterItemsByCategory(i)} />)}
      </div>
      <Grid container alignItems='center' justify='center'>

        {
          items.length > 0 ? (

            items.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                <CardItem item={item} />
              </Grid>

            ))

          ) : (
              <div style={{ display: 'flex', margin: '0 auto', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
                <h3>No Products</h3>
              </div>
            )
        }

      </Grid>

    </div>

  )
};

export default AllItems;
