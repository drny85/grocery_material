import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionCard from "../../components/ActionCard/ActionCard";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from "moment";

import "./styles.css";
import Controls from "../../components/controls/Controls";
import { Typography } from "@material-ui/core";
import { closeOpenStore } from "../../reduxStore/actions/userActions";
import BackArrow from "../../components/BackArrow";
import { useHistory } from "react-router-dom";

const AdminPage = () => {
  const history = useHistory();
  const { store } = useSelector((state) => state.userData);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleOpenCloseStore = () => {
    dispatch(closeOpenStore());
    closeModal();
  };

  const closeModal = () => {
    setOpen(false);
  };
  return (
    <div className="main">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: '1280px',
          padding: "1rem 2rem",
          margin: '0.5rem auto'
        }}
      >
        <BackArrow />
        <Typography variant="h6" align="center">
          Admin Page
        </Typography>
        <Controls.Button
          text={"View Today's Orders"}
          color="secondary"
          onClick={() => history.push("/orders")}
        />
      </div>
      <div className="home_container">
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {store && store.open ? "Closing Store" : "Opening Store"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {store && store.open
                ? "Are you sure you want to close the store?"
                : "Are you sure that you want to open the store?"}
            </DialogContentText>
            <Typography>Current Time: {moment().format("LTS")}</Typography>
          </DialogContent>
          <DialogActions>
            <Controls.Button
              text="Cancel"
              color="secondary"
              onClick={closeModal}
            />
            <Controls.Button
              color="primary"
              text={store && store.open ? "Close Store" : "Open Store"}
              onClick={handleOpenCloseStore}
            />
          </DialogActions>
        </Dialog>

        <ActionCard
          title={store && store.open ? "Close Store" : "Open Store"}
          onClick={() => setOpen(true)}
        />
        <ActionCard title='Add New Item' onClick={() => history.push('/admin/item')} />
      </div>
    </div>
  );
};

export default AdminPage;
