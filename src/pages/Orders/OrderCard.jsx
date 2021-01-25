import { Hidden, Typography } from "@material-ui/core";
import React from "react";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

import moment from "moment";

import "./styles.css";

const OrderCard = ({ order, onClick, shrink = false }) => {

  return (
    <>
      {shrink ? (<div onClick={onClick} style={{
        display: "flex", justifyContent: 'space-between', alignItems: 'center', backgroundColor:
          order?.status === "delivered" || order?.status === "pickup"
            ? "#4caf50"
            : order?.status === "in progress"
              ? "#ffc107"
              : order?.status === "canceled"
                ? "#ff784e"
                : "#b0bec5",
        boxShadow: '3px 5px 3px rgba(0,0,0,0.4)',
        padding: '1.5rem 1rem',
        margin: '1.5rem',
        borderRadius: '10px'
      }}>
        <Typography variant='body1'>Order #{order?.orderNumber}</Typography>
        {order?.orderType === "delivery" ? (
          <LocalShippingIcon />
        ) : (
            <DirectionsWalkIcon />
          )}
        <Typography variant='body1'>Items {order?.items.length}</Typography>
        <Hidden smDown>
          <Typography>${order.totalAmount.toFixed(2)}</Typography>
        </Hidden>

      </div>) : (
          <div
            onClick={onClick}
            style={{
              backgroundColor:
                order?.status === "delivered" || order?.status === "pickup"
                  ? "#4caf50"
                  : order?.status === "in progress"
                    ? "#ffc107"
                    : order?.status === "canceled"
                      ? "#ff784e"
                      : "#b0bec5",
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
                {order?.items.map((item, i) => {

                  return <Typography key={item.id + (i).toString()} component="li" variant="subtitle2">
                    {item.name}
                  </Typography>
                }
                )}
              </div>
            </div>
            <div className="order_card_bottom">
              <Typography>
                Customer: {order.customer.name} {order.customer.lastName}
              </Typography>
              <Typography>
                Order Type: {order?.orderType === "delivery" ? "Delivery" : "Pick Up"}
              </Typography>
              <Typography style={{ textTransform: "capitalize" }}>
                Payment: {order?.paymentMethod}
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
            <div className="price">
              <Typography variant="h6">
                Total ${order?.totalAmount.toFixed(2)}
              </Typography>
            </div>
          </div>
        )}</>

  );
};

export default OrderCard;
