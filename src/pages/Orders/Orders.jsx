import { Grid, Typography } from "@material-ui/core";

import { useHistory } from "react-router-dom";
import BackArrow from "../../components/BackArrow";
import Controls from "../../components/controls/Controls";
import { useDatedOrders } from "../../utils/useDatedOrders";
import OrderCard from "./OrderCard";

const Orders = () => {
  const history = useHistory();
  const orders = useDatedOrders();

  const checkForCancels = () => {
    const found = orders.find((o) => o.status === "canceled");
    if (found) return true;
    return false;
  };
  return (
    <div
      style={{
        maxWidth: "1280px",

        margin: "1rem auto",
      }}
    >
      <div
        className="top_buttons"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BackArrow />
        <Typography variant="h4">Today's Orders</Typography>
        <Controls.Button
          text="View Past Orders"
          onClick={() => history.push("/pastOrders")}
        />
      </div>

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

          <Grid item xs={12} sm={checkForCancels() ? 3 : 4}>
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
          <Grid item xs={12} sm={checkForCancels() ? 3 : 4}>
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
          <Grid item xs={12} sm={checkForCancels() ? 3 : 4}>
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
          {checkForCancels() && (
            <Grid item xs={12} sm={3}>
              <Typography variant="h5" align="center">
                Canceled (
                {orders.filter((order) => order.status === "canceled").length})
              </Typography>
              {orders.filter((order) => order.status === "canceled").length >
                0 &&
                orders
                  .filter((order) => order.status === "canceled")
                  .map((order) => (
                    <OrderCard
                      onClick={() => history.push(`/orders/${order.id}`)}
                      key={order.id}
                      order={order}
                    />
                  ))}
            </Grid>
          )}
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
