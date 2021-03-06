import { useTheme } from "@material-ui/core";
import React from "react";

const CategoryScrollItem = ({ id, name, selected, count, onClick }) => {
  const theme = useTheme()

  return (
    <div
      onClick={onClick}

      style={{
        display: "flex",
        height: "3rem",
        backgroundColor: id === selected ? theme.palette.secondary.main : "#eee",
        padding: "1rem 2rem",
        borderRadius: "20px",
        justifyContent: "center",
        alignItems: "center",

        margin: "0.5rem 0.7rem",
        boxShadow: "3px 5px 5px rgba(0,0,0,0.5)",
      }}
    >
      <h4 className="capitalize">{name} {count && `(${(count)})`}</h4>
    </div>
  );
};

export default CategoryScrollItem;
