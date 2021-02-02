import { TextField } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    borderRadius: "30px",
    textAlign: "center",
    border: "none",
  },
  input: {
    "&::placeholder": {
      color: "blue",
    },
  },
}));

const SearchBar = ({ label, filterFunction, clearFilter }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onChange = (e) => {
    let value = e.target.value;
    if (value !== "") {
      dispatch(filterFunction && filterFunction(value));
    } else {
      dispatch(clearFilter && clearFilter());
    }
  };

  return (
    <TextField
      variant="outlined"
      fullWidth
      InputLabelProps={{
        style: {
          color: "gray",
        },
      }}
      className={classes.margin}
      onChange={onChange}
      label={label}
    />
  );
};

export default SearchBar;
