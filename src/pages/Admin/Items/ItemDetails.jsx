import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import BackArrow from "../../../components/BackArrow";
import DeleteIcon from '@material-ui/icons/Delete';
import Controls from "../../../components/controls/Controls";
import Loader from "../../../components/Loader";
import {

  changeAvailability,
  clearCurrentItem,
  deleteItem,
  setCurrentItem,
} from "../../../reduxStore/actions/itemsActions";

import "./styles.css";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.error.dark
  },
  btn: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.warning.dark
  },
  cancelBtn: {
    color: theme.palette.warning.light
  },
  deleteBtn: {
    color: theme.palette.error.dark
  }
}));

const ItemDetails = ({ history }) => {
  const classes = useStyles();
  const { id } = useParams();
  const [isAvailable, setIsAvailable] = useState(false)
  const { store, user } = useSelector((state) => state.userData);
  const { current, loading } = useSelector((state) => state.itemsData);

  const [show, setShow] = useState(false)
  const dispatch = useDispatch();


  const handleDelete = async () => {

    const deleted = await dispatch(deleteItem(id, store?.id))
    if (deleted) {
      history.goBack()
    }
  }

  const handleAvailibility = async (e) => {
    try {
      const res = await dispatch(changeAvailability(current?.id, !current?.available, current?.storeId))
      setIsAvailable(res)
    } catch (error) {
      console.log(error)
    }

  }


  useEffect(() => {
    !current && dispatch(setCurrentItem(id, store?.id))
    if (current) {
      setIsAvailable(current.available)

    }

    return () => {
      dispatch(clearCurrentItem())
    };

    //eslint-disable-next-line
  }, [dispatch, id, store?.id]);


  if (loading || !current) {
    return <Loader />
  }
  return (
    <div className="main">
      <div style={{ maxWidth: "1080px", margin: "1rem auto", display: 'flex', justifyContent: 'space-between' }}>
        <BackArrow />
        <Typography variant="h4" align="center">
          Item Details
        </Typography>
        {user && user.isAdmin ? (<Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => setShow(true)}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>) : (<Typography></Typography>)}

      </div>

      <div className="item-detail-div">
        <div
          style={{ backgroundImage: `url(${current?.imageUrl})` }}
          className="image-div"
        ></div>
        <div className="desc-div">
          <div className="name_top" style={{ display: 'flex', alignItems: 'center', justifyContent: user && user.isAdmin ? 'space-between' : 'center' }}>
            <Typography className="capitalize" align="center" variant="h5">
              {current?.name}
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography>Available: {isAvailable ? 'Yes' : 'No'} </Typography>
              <Controls.Button text={current?.available ? 'Mark Unavailable' : 'Mark Available'} style={{ backgroundColor: isAvailable ? 'green' : 'orange' }} size="smaill" onClick={handleAvailibility} />
            </div>


          </div>

          <Typography style={{ padding: "1rem" }} variant="subtitle2">
            {current?.description}
          </Typography>
          <div style={{ display: "flex" }} className="sizes">
            {current.sizes &&
              current.sizes.map((size, i) => (
                <Typography
                  style={{ margin: "1rem", textTransform: "capitalize" }}
                  key={size}
                >
                  {`${size}: $${current?.price[size]}`}
                </Typography>
              ))}
          </div>
          <div className="desc-price">
            {current.sizes
              ? `As low as $${current.price[current.sizes[0]]}`
              : `$${current?.price}`}
            {user && user.isAdmin && (
              <Controls.Button
                text="Edit Item"
                className={classes.btn}

                onClick={() => history.push(`/admin/item/edit/${current?.id}`)}
              />
            )}
            <Typography>Unit Sold: {current?.unitSold}</Typography>
          </div>

          {/* <Typography>${current?.price}</Typography> */}
        </div>
        <Dialog open={show}>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className={classes.cancelBtn} variant='outlined' onClick={() => setShow(false)}>Cancel</Button>
            <Button className={classes.deleteBtn} variant='outlined' onClick={handleDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ItemDetails;
