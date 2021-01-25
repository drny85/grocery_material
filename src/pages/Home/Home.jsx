import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ActionCard from "../../components/ActionCard/ActionCard";

import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import moment from "moment";

//import Button from '@material-ui/core/Button';
//import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100vw",
    height: "90vh",
    maxWidth: "1800px",
    maxWwidth: "2680px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.2rem",
    overflow: "hidden",
    margin: "0 auto",
  },

  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const Home = () => {
  const { user, store } = useSelector((state) => state.userData);
  const classes = useStyles();
  const history = useHistory();
  const [today, setToday] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(moment().format("MMMM Do YYYY, h:mm:ss a"));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!user) history.replace("/signin");
  return (
    <div className="main">
      <div
        className="main-top"
        style={{
          display: "flex",
          margin: '0.5rem auto',
          width: "100%",
          maxWidth: '1280px',
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {store && store.open ? (
          <Typography variant="h4">Store Open</Typography>
        ) : (
            <Typography variant="h4">Store Closed</Typography>
          )}

        <Typography variant="h5">{today}</Typography>
      </div>
      <div className={classes.root}>
        <ActionCard
          title="Today`s Orders"
          onClick={() => {
            if (store && store.open) {
              history.push("/orders");
            } else {
              alert("Store is closed");
            }
          }}
        />
        <ActionCard
          title="Admin"
          onClick={() => {
            history.push("/admin");
          }}
        />
        <ActionCard
          title="Past Orders"
          onClick={() => history.push("/pastOrders")}
        />
        <ActionCard
          title="Products/Items"
          onClick={() => history.push("/admin/allItems/all")}
        />
        <ActionCard
          title="Categories"
          onClick={() => history.push("/categories")}
        />
        <ActionCard title="Home" onClick={() => { }} />
      </div>
    </div>
  );
};

export default Home;
