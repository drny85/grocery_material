import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  Paper,
  makeStyles,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../reduxStore/actions/ordersActions";
import { useHistory } from "react-router-dom";
import Loader from "../../components/Loader";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },

  cell: {
    backgroundColor: theme.palette.action.focus,
    fontWeight: "bold",
  },
}));

const PastOrders = () => {
  const history = useHistory();
  const { orders, loading } = useSelector((state) => state.ordersData);
  const { user } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);

  useEffect(() => {
    dispatch(getOrders(user?.store));
  }, [dispatch, user]);

  if (loading) return <Loader />;
  return (
    <div tyle={{ maxWidth: "1080px" }}>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>Order #</TableCell>
              <TableCell className={classes.cell}>Customer</TableCell>
              <TableCell className={classes.cell}>Amount</TableCell>
              <TableCell className={classes.cell}>Date</TableCell>
              <TableCell className={classes.cell}>Delivered</TableCell>
              <TableCell className={classes.cell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="capitalize">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="capitalize">
                    {order.customer.name} {order.customer.lastName}
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(order.orderPlaced).toLocaleString()}
                  </TableCell>
                  <TableCell>{order.deliveredOn ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => history.push(`/orders/${order.id}`)}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 30]}
          component="div"
          count={orders.length}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default PastOrders;
