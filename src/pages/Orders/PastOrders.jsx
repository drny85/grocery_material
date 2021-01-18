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
  Grid,
  TablePagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOrderFilter,
  filterOrderByDates,
  getOrders,
} from "../../reduxStore/actions/ordersActions";
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
    margin: "1rem auto",
  },
}));

const PastOrders = () => {
  const history = useHistory();

  const { orders, loading, filtered } = useSelector(
    (state) => state.ordersData
  );
  const { user } = useSelector((state) => state.userData);
  const [startDate, setStartDate] = useState(new Date());
  const [untilDate, setUntiltDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
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
    rowsPerPage -
    Math.min(
      rowsPerPage,
      (filtered.length > 0 ? filtered : orders) - page * rowsPerPage
    );

  const filterByDates = () => {
    const isGood = startDate <= untilDate;
    if (isGood) {
      dispatch(filterOrderByDates(startDate, untilDate));
      setIsSorted(true);
      setShow(false);
    }
  };

  const clearFilterandMore = () => {
    if (isSorted) {
      setIsSorted(false);
      setShow(false);
      dispatch(clearOrderFilter());
    } else {
      setShow(true);
    }
  };

  const orderStatus = (status) => {
    switch (status) {
      case "canceled":
        return "Canceled";
      case "new":
        return "New";
      case "in progress":
        return "In Progress";
      case "pickup":
        return "Picked Up";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(getOrders(user.store));
    }

    return () => {
      dispatch(clearOrderFilter());
    };
  }, [dispatch, user]);

  if (loading) return <Loader />;
  return (
    <div
      style={{
        maxWidth: "1080px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "1rem auto",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <BackArrow />
        <Typography variant="h6" align="center">
          {isSorted
            ? `Orders from ${moment(startDate).format("MMM Do YY")} to ${moment(
              untilDate
            ).format("MMM Do YY")}`
            : "Orders Look Up"}
        </Typography>
        <Controls.Button
          text={isSorted ? "Clear Filters" : "Filter By Dates"}
          color="secondary"
          onClick={clearFilterandMore}
        />
      </div>
      <Dialog open={show} fullWidth>
        <DialogTitle>Orders Between:</DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog-1"
                label="From This Date"
                format="MM/dd/yyyy"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog-2"
                label="Until This Date"
                format="MM/dd/yyyy"
                value={untilDate}
                onChange={(date) => setUntiltDate(date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Controls.Button
            text="Cancel"
            color="secondary"
            onClick={() => setShow(false)}
          />
          <Controls.Button
            text="Search"
            color="primary"
            onClick={filterByDates}
          />
        </DialogActions>
      </Dialog>

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
              <TableCell className={classes.cell}>Status</TableCell>
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
                  <TableCell>{orderStatus(order.status)}</TableCell>
                  <TableCell>
                    <Controls.Button
                      text="View Order"
                      size="small"
                      onClick={() => history.push(`/orders/${order.id}`)}
                    />
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
