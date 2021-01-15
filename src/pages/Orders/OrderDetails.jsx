import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    DialogContentText,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import moment from "moment";
import {
    setCurrentOrder,
    changeStatus,
} from "../../reduxStore/actions/ordersActions";

import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import OrderItem from "../../components/Order/OrderItem";
import BackArrow from "../../components/BackArrow";
import Controls from "../../components/controls/Controls";

import { phoneFormatted } from "../../utils/phoneFormatted";
import sendNotification from "../../utils/sendNotification";

import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const options = [
    {
        id: "new",
        name: "New",
    },
    {
        id: "in progress",
        name: "In Progress",
    },
    {
        id: "delivered",
        name: "Delivered",
    },
    {
        id: "pickup",
        name: "Picked Up",
    },
];

const OrderDetails = () => {
    const { id } = useParams();
    const { current, loading } = useSelector((state) => state.ordersData);
    const { user } = useSelector((state) => state.userData);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [modalAlert, setModalAlert] = useState(false);
    const [status, setStatus] = useState('');

    const isDelivery = () => current?.orderType === "delivery";

    const changeOrderStatus = () => {
        if (status !== "") {
            if (current.status === "delivered") {
                setShow(false);
                setModalAlert(true);
                setStatus("");
                return;
            }
            if (status === "delivered") {
                dispatch(changeStatus(current.id, status, user));
                setShow(false);
                setStatus("");
            } else if (status === "pickup") {
                dispatch(changeStatus(current.id, status, user));
                setShow(false);
                setStatus("");
                sendNotification(
                    `Congratulations ${current.customer.name}!`,
                    "Your order has been picked up, enjoy!",
                    current
                );
            } else {
                dispatch(changeStatus(current.id, status));
                setShow(false);
                setStatus("");
            }
        }

        if (status === "delivered") {
            // send notification to user when order is delivered
            //@params { title = string, body = string, order = object}
            if (!current.deliveredOn) {
                sendNotification(
                    `Congratulations ${current.customer.name}!`,
                    "Your order is on its way!",
                    current
                );
            }
        }
    };

    useEffect(() => {
        dispatch(setCurrentOrder(id));

        return () => {
            //clearCurrent();
            setShow(false);
        };
    }, [id, dispatch]);

    if (!current || loading) return <Loader />;
    return (
        <div>
            {/* Modal for changing order status */}
            <Dialog
                open={show}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Change Order Status</DialogTitle>
                <DialogContent>
                    <div
                        className="content_dialog"
                        style={{ width: "100%", height: "8rem" }}
                    >
                        <Controls.Select
                            value={status}
                            label="Status"
                            options={
                                current.orderType === "pickup"
                                    ? options.filter((s) => s.id !== "delivered")
                                    : options.filter((i) => i.id !== "pickup")
                            }
                            onChange={(e) => setStatus(e.target.value)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Controls.Button
                        color="secondary"
                        text="Cancel"
                        onClick={() => setShow(false)}
                    />
                    <Controls.Button text="Change" onClick={changeOrderStatus} />
                </DialogActions>
            </Dialog>
            {/* alert if order already marked as delivered */}
            <Dialog
                open={modalAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"WARNING!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This order has been marked as Delivery already. Contact the customer
                        to inform any changes.
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Controls.Button text="Okay" onClick={() => setModalAlert(false)} />
                </DialogActions>
            </Dialog>
            <div className="order_details_container">
                <Typography variant="h5">Order Details</Typography>

                <div className="top">
                    <BackArrow />
                    <div className="order_number">
                        <Typography variant="h6">
                            {current.customer.name} {current.customer.lastName}
                        </Typography>
                        {current.orderType === "delivery" ? (
                            <LocalShippingIcon />
                        ) : (
                                <DirectionsWalkIcon />
                            )}
                        <Typography>Order # {current.orderNumber}</Typography>
                    </div>

                    <div className="top_details">
                        <div className="customer">
                            <Typography variant="body2">
                                Order Date: {moment(current.orderPlaced).calendar()}
                            </Typography>
                            <Typography variant="body2">
                                Customer Phone: {phoneFormatted(current.customer.phone)}
                            </Typography>
                            <Typography variant="body2">
                                Customer Email: {current.customer.email}
                            </Typography>
                            <Typography variant="body2">
                                Order Type: {isDelivery() ? "Delivery" : "Pick Up"}
                            </Typography>
                            {isDelivery() ? (
                                <Typography>
                                    Address: {current.customer.address.street}{" "}
                                    {current.customer.address.apt && current.customer.address.apt}
                  , {current.customer.address.city}{" "}
                                    {current.customer.address.zipcode}
                                </Typography>
                            ) : (
                                    <Typography></Typography>
                                )}
                            <Typography
                                variant="body2"
                                style={{ textTransform: "capitalize" }}
                            >
                                Payment Type: {current.paymentMethod}
                            </Typography>
                            {current.instruction && (
                                <Typography variant="body2">
                                    Delivery Instuctions: {current.instruction}
                                </Typography>
                            )}
                        </div>
                        <div className="actions">
                            <Typography
                                style={{ textTransform: "capitalize", padding: "0.5rem" }}
                            >
                                Current Status: {current.status}
                            </Typography>
                            <Controls.Button
                                text="Change Status"
                                onClick={() => setShow(true)}
                            />
                        </div>
                    </div>
                    <div className="bottom_details">
                        {current.items.map((item) => (
                            <OrderItem
                                key={item.size ? item.id + item.size : item.id}
                                item={item}
                            />
                        ))}
                    </div>
                    <div className="totalPrice">
                        <Typography variant="h6">Grand Total</Typography>
                        <Typography variant="h6">
                            ${current.totalAmount.toFixed(2)}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
