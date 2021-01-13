import { Typography, useTheme } from "@material-ui/core";
import React from "react";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

import moment from "moment";

import "./styles.css";

const OrderCard = ({ order, onClick }) => {
  const theme = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor:
          order?.status === "delivered" || order?.status === "pickup"
            ? "#4caf50"
            : order?.status === "in progress"
            ? "#ffc107"
            : "#3f51b5",
      }}
      className="order_card"
    >
      <div className="order_card_top">
        <Typography variant="h5">Order #{order?.orderNumber}</Typography>
        {order?.orderType === "delivery" ? (
          <LocalShippingIcon />
        ) : (
          <DirectionsWalkIcon />
        )}
        <Typography variant="h6">Items {order?.items.length}</Typography>
      </div>
      <div className="details_order_card">
        <div className="items">
          {order?.items.map((order) => (
            <Typography key={order.id} component="li" variant="subtitle2">
              {order.name}
            </Typography>
          ))}
        </div>
        <div className="price">
          <Typography>Total ${order?.totalAmount.toFixed(2)}</Typography>
        </div>
      </div>
      <div className="order_card_bottom">
        <Typography>
          Customer: {order.customer.name} {order.customer.lastName}
        </Typography>
        <Typography>
          Order Type: {order?.orderType === "delivery" ? "Delivery" : "Pick Up"}
        </Typography>
        {order?.orderType === "delivery" && (
          <Typography>
            {" "}
            Address: {order?.customer.address.street},{" "}
            {order?.customer.address.zipcode}
          </Typography>
        )}
        <Typography>Date: {moment(order?.orderPlaced).calendar()}</Typography>
        <Typography style={{ textTransform: "uppercase" }}>
          Status: {order.status}
        </Typography>
      </div>
    </div>
  );
};

export default OrderCard;
