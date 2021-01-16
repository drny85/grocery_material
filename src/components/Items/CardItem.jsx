import { Typography } from "@material-ui/core";
import React from "react";

import "./styles.css";

const CardItem = ({ item }) => {
  return (
    <div className="card_item">
      <div
        className="item_image"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      ></div>
      <div className="item_details">
        <Typography>{item.name}</Typography>
      </div>
    </div>
  );
};

export default CardItem;
