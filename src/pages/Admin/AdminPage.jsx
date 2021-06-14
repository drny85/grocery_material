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
import { closeOpenStore, logout } from "../../reduxStore/actions/userActions";
import BackArrow from "../../components/BackArrow";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from "react-router-dom";

const AdminPage = () => {
  const history = useHistory();
  const { store, user } = useSelector((state) => state.userData);

  const [open, setOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const handleOpenCloseStore = () => {
    dispatch(closeOpenStore());
    closeModal();
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout())

    setOpenLogoutModal(false)
    history.replace('/')
  }


  return (
    <div className="main" style={{ display: 'flex', flexDirection: 'column', maxWidth: '1080px', margin: '0 auto' }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: '1080px',
          padding: "1rem 2rem",
          margin: '0.5rem auto'
        }}
      >
        <BackArrow />
        <Typography variant="h6" align="center">
          Admin Page
        </Typography>
        <div>
          <Controls.Button

            text={"Today's Orders"}
            size='small'
            color="secondary"
            onClick={() => history.push("/orders")}
          />
          {user && user.isAdmin && (<Controls.Button size='small' text='Exit' style={{ backgroundColor: 'orange' }} EndIcon={<ExitToAppIcon />} onClick={() => setOpenLogoutModal(true)} />)}
        </div>

      </div>
      <div className="home_container" style={{ width: '100%' }}>
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
        {/* LOGOUT MODAL */}
        <Dialog

          open={openLogoutModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Loging Out
          </DialogTitle>
          <DialogContent style={{ width: '20rem', maxWidth: '25rem' }}>
            <DialogContentText align='center' id="alert-dialog-description">
              LOG OUT ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Controls.Button
              text="No"
              color="secondary"
              onClick={() => setOpenLogoutModal(false)}
            />
            <Controls.Button
              color="primary"
              text='YES'
              onClick={handleLogout}
            />
          </DialogActions>
        </Dialog>

        <ActionCard
          title={store && store.open ? "Close Store" : "Open Store"}
          onClick={() => setOpen(true)}
        />
        <ActionCard title='Add New Item' onClick={() => history.push('/admin/item')} />
        <ActionCard title='Store Info' onClick={() => history.push(`/admin/storeInfo/${store.id}`)} />
        <ActionCard title='Manage Coupons' onClick={() => history.push('/admin/coupons')} />
        {user && (user.email === 'admin@admin.com' || user.email === 'melendez@robertdev.net') && (
          <ActionCard title='Manage Stores' onClick={() => history.push('/admin/stores')} />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
