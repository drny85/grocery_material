import { Grid, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import BackArrow from "../../components/BackArrow";
import Loader from "../../components/Loader";
import { getOrders } from "../../reduxStore/actions/ordersActions";
import useDatedOrders from "../../utils/useDatedOrders";
import OrderCard from "./OrderCard";

const Orders = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  //const { orders, loading } = useSelector((state) => state.ordersData);
  const { user } = useSelector((state) => state.userData);
  const orders = useDatedOrders();

  //   useEffect(() => {
  //     dispatch(getOrders(user?.store));

  //     return () => {
  //       // unsudscribe && unsudscribe()
  //     };
  //   }, [dispatch, user]);

  //if (loading) return <Loader />;

  return (
    <div
      style={{
        maxWidth: "1280px",

        margin: "1rem auto",
      }}
    >
      <BackArrow />
      <Typography variant="h4" align="center">
        Today's Orders
      </Typography>
      <div
        style={{
          borderBottom: "solid 1px lightgray",
          width: "100%",
          margin: "10px 0",
        }}
      ></div>
      {orders.length > 0 ? (
        <Grid container>
          {/* <Typography variant='h3'>Orders</Typography> */}

          <Grid item xs={12} sm={4}>
            <Typography variant="h5" align="center">
              New ({orders.filter((order) => order.status === "new").length})
            </Typography>
            {orders.filter((order) => order.status === "new").length > 0 &&
              orders
                .filter((order) => order.status === "new")
                .map((order) => (
                  <OrderCard
                    onClick={() => history.push(`/orders/${order.id}`)}
                    key={order.id}
                    order={order}
                  />
                ))}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" align="center">
              In Progress (
              {orders.filter((order) => order.status === "in progress").length})
            </Typography>
            {orders.filter((o) => o.status === "in progress").length > 0 &&
              orders
                .filter((order) => order.status === "in progress")
                .map((order) => (
                  <OrderCard
                    onClick={() => history.push(`/orders/${order.id}`)}
                    key={order.id}
                    order={order}
                  />
                ))}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" align="center">
              Delivered/Picked Up (
              {
                orders.filter(
                  (order) =>
                    order.status === "delivered" || order.status === "pickup"
                ).length
              }
              )
            </Typography>
            {orders.filter(
              (o) => o.status === "delivered" || o.status === "pickup"
            ).length > 0 &&
              orders
                .filter(
                  (order) =>
                    order.status === "delivered" || order.status === "pickup"
                )
                .map((order) => (
                  <OrderCard
                    onClick={() => history.push(`/orders/${order.id}`)}
                    key={order.id}
                    order={order}
                  />
                ))}
          </Grid>
        </Grid>
      ) : (
        <div
          className="no_orders"
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            width: "800px",
            height: "100vh",
            flexDirection: "column",
            margin: "0 auto",
          }}
        >
          <Typography align="center">No Orders</Typography>
        </div>
      )}
    </div>
  );
};

export default Orders;
