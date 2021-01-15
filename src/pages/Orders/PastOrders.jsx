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

  TablePagination,
  Typography,
} from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { clearOrderFilter, getOrders } from "../../reduxStore/actions/ordersActions";
import { useHistory } from "react-router-dom";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Controls from "../../components/controls/Controls";
import BackArrow from "../../components/BackArrow";


const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    maxWidth: 1080,


  },

  cell: {
    backgroundColor: theme.palette.action.focus,
    fontWeight: "bold",
  },
  pag: {
    minWidth: 650,
    maxWidth: 1080,
    margin: '1rem auto',
  },

}));

const PastOrders = () => {
  const history = useHistory();
  const { orders, loading, filtered } = useSelector((state) => state.ordersData);
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
    rowsPerPage - Math.min(rowsPerPage, (filtered.length > 0 ? filtered : orders) - page * rowsPerPage);



  useEffect(() => {
    if (user) {
      dispatch(getOrders(user.store));
    }

    return () => {
      dispatch(clearOrderFilter())
    }

  }, [dispatch, user]);

  if (loading) return <Loader />;
  return (
    <div style={{ maxWidth: "1080px", display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem auto', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <BackArrow />
        <Typography variant="h4" align="center">
          Orders Look Up
      </Typography>
        <div></div>
      </div>

      <div
        style={{
          borderBottom: "solid 1px lightgray",
          width: "100%",
          margin: "10px 0",
        }}
      ></div>
      <SearchBar />
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
            {(filtered.length > 0 ? filtered : orders)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
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
                    <Controls.Button text='View Order' size='small' onClick={() => history.push(`/orders/${order.id}`)} />
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
          className={classes.pag}
          rowsPerPageOptions={[5, 10, 15, 20, 30]}
          component="div"
          count={(filtered.length > 0 ? filtered : orders).length}
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
