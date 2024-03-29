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
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import moment from "moment";
import {
  setCurrentOrder,
  clearCurrentOrder,
  changeStatus,
} from "../../reduxStore/actions/ordersActions";

import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import OrderItem from "../../components/Order/OrderItem";
import BackArrow from "../../components/BackArrow";
import EditIcon from '@material-ui/icons/Edit';
import Controls from "../../components/controls/Controls";
import { phoneFormatted } from "../../utils/phoneFormatted";
import sendNotification from "../../utils/sendNotification";
import PaymentIcon from '@material-ui/icons/Payment';

import { loadStripe } from '@stripe/stripe-js'

import Slide from "@material-ui/core/Slide";
import { options } from "../../utils/constants";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const OrderDetails = () => {
  const { id } = useParams();
  const { current } = useSelector((state) => state.ordersData);
  const { user } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [checkModal, setCheckModal] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false)
  const [modalAlert, setModalAlert] = useState(false);
  const [status, setStatus] = useState("");
  const history = useHistory()
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
      } else if (status === 'canceled') {
        if (reason === '') {
          setError('You must provide a reason for cancellation')
          return
        } else {

          dispatch(changeStatus(current.id, status, user, reason))
          setShow(false)
          setStatus('')
          setReason('')
          setError(null)
          sendNotification(`We sorry ${current.customer.name}`, `Your order has been canceled. Reason: ${reason}`,
            current
          )
        }
      }
      else {
        dispatch(changeStatus(current.id, status));
        setShow(false);
        setStatus("");
        setReason('')
        setError(null)
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
    history.goBack()
  };

  const goToPaymentScreen = async () => {
    try {
      setProcessing(true)
      const res = await axios.get(`https://us-central1-grocery-409ef.cloudfunctions.net/makePayment/stripeKey/${current.restaurantId}`)
      const data = await axios.post('https://us-central1-grocery-409ef.cloudfunctions.net/makePayment/create_stripe_customer', { userId: current?.userId, email: current.customer.email, restaurantId: current.restaurantId, name: current.customer.name + ' ' + current.customer.lastName })
      const { customer_id } = data.data;
      const publicKey = await res.data
      const { items } = current

      if (publicKey && current) {
        const stripe = await loadStripe(publicKey)
        const checkoutSession = await axios.post("https://us-central1-grocery-409ef.cloudfunctions.net/makePayment/payment", {
          amount: current.totalAmount,
          items: items,
          orderId: current.id,
          customerId: customer_id,
          email: current.customer.email,
          phone: current.customer.phone,
          customer: current.customer.address,
          cardFee: current.restaurant.chargeCardFee
        })


        const result = await stripe.redirectToCheckout({
          sessionId: checkoutSession.data.session_id
        })

        if (result.error) {
          alert(error.message)
        }
        console.log(result)

      }

    } catch (error) {
      console.log(error.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleEditOrder = () => {
    history.push(`/admin/edit-order/${id}`)
  }
  useEffect(() => {
    dispatch(setCurrentOrder(id));

    return () => {
      dispatch(clearCurrentOrder())
      setShow(false);
    };
  }, [id, dispatch]);

  console.log(current?.status)

  if (!current || processing) return <Loader />;
  return (
    <div>
      <Dialog open={checkModal}>
        <DialogContent>
          <DialogTitle>This order was marked as {current?.status}

          </DialogTitle>
          <Typography variant='subtitle1' align='center'>Do you still want to make changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Controls.Button text='No' color='primary' onClick={() => setCheckModal(false)} />
          <Controls.Button text='Yes' color='secondary' onClick={() => {
            setCheckModal(false)
            setShow(true)
          }} />
        </DialogActions>

      </Dialog>
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
            style={{ width: status === 'canceled' ? '30vw' : 'auto', height: "auto", maxHeight: '20rem', }}
          >
            <Controls.Select
              style={{ width: '100%' }}
              value={status}
              label="Status"
              options={
                current.orderType === "pickup"
                  ? options.filter((s) => s.id !== "delivered")
                  : options.filter((i) => i.id !== "pickup")
              }
              onChange={(e) => setStatus(e.target.value)}
            />
            {status === 'canceled' && (
              <div style={{ width: '100%', marginTop: '1rem' }}>
                <Controls.Input style={{ width: '100%' }} multiline={true} value={reason} error={error} onChange={e => setReason(e.target.value)} label='Cancellation Reason' />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Controls.Button
            color="secondary"
            text="Cancel"
            onClick={() => {
              setShow(false)
              setReason('')
            }}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <BackArrow onClick={() => history.push('/orders')} />
          <Typography variant="h5">Order Details</Typography>
          <div>
            {!current.isPaid && <Controls.Button disable={processing} style={{ backgroundColor: 'grey' }} onClick={goToPaymentScreen} text="Take Payment" EndIcon={<PaymentIcon />} />}
            <Controls.Button disabled={current.isPaid} style={{ backgroundColor: 'orange' }} onClick={handleEditOrder} text="Edit Order" EndIcon={<EditIcon />} />
          </div>

        </div>
        <div className="top">

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
              {current.cancelReason && (<Typography>Cancellation Reason: {current.cancelReason}</Typography>)}
              <Typography
                variant="body2"
                style={{ textTransform: "capitalize" }}
              >
                Payment Type: {current.paymentMethod}
              </Typography>
              <Typography
                variant="body2"
                style={{ textTransform: "capitalize" }}
              >
                Paid: {current.isPaid ? 'Yes' : 'No'}
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
                onClick={() => {
                  if (current?.status === 'pickup' || current?.status === 'delivered') {
                    setCheckModal(true)
                  } else {

                    setShow(true)
                  }
                }}
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
              ${current.totalAmount}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
