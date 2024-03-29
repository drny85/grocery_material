import React from "react";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useTheme } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const BackArrow = ({ onClick }) => {
  const theme = useTheme();
  const history = useHistory();
  return (
    <div
      onClick={onClick ? onClick : () => history.goBack()}
      style={{
        alignItems: "center",
        borderRadius: "10px",
        backgroundColor: theme.palette.divider,
        padding: "0.5rem 1.5rem",
        justifyContent: "center",
        display: "flex",
        float: "left",

      }}
      className="back"
    >
      <ArrowBackIcon /> Back
    </div>
  );
};

export default BackArrow;
