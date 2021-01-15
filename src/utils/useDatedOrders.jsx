import { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../reduxStore/actions/ordersActions";
import Loader from "../components/Loader";

export const useDatedOrders = (startDate = new Date(), endDate = new Date()) => {
  const { orders, loading } = useSelector((state) => state.ordersData);
  const { user } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const start = moment(startDate).startOf("day");
  const end = moment(endDate).endOf("day");

  const sorted = orders.filter(
    (order) =>
      moment(order.orderPlaced).isAfter(start) &&
      moment(order.orderPlaced).isBefore(end)
  );

  useEffect(() => {
    dispatch(getOrders(user?.store));

    // eslint-disable-next-line
  }, [dispatch, user]);

  if (loading) return <Loader />

  return sorted;
};


