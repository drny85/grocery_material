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
    gap: "0.5rem",
    overflow: "hidden",
    margin: "0.5rem",
  },

  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const Home = () => {
  const { user } = useSelector((state) => state.userData);
  const classes = useStyles();
  const history = useHistory();
  const [today, setToday] = useState('')

  useEffect(() => {
    const interval = setInterval(() => { setToday(moment().format('MMMM Do YYYY, h:mm:ss a')) }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!user) history.replace("/signin");
  return (
    <div className="main">
      <div className="main-top" style={{ display: 'flex', padding: '0.5rem 2rem', width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <Typography variant='h5'>{today}</Typography>
      </div>
      <div className={classes.root}>
        <ActionCard
          title="Today`s Orders"
          onClick={() => {
            history.push("/orders");
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
        <ActionCard title="Products/Items" onClick={() => { }} />
        <ActionCard title="Categories" onClick={() => { }} />
        <ActionCard title="Home" onClick={() => { }} />
      </div>
    </div>

  );
};

export default Home;
