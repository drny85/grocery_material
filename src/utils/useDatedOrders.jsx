import { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../reduxStore/actions/ordersActions";

export const useDatedOrders = (startDate = new Date(), endDate = new Date()) => {
  const { orders } = useSelector((state) => state.ordersData);
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

  return sorted;
};


