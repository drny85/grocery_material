import React from "react";

const CategoryScrollItem = ({ name, selected, onClick, onDoubleClick }) => {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        display: "flex",
        height: "3rem",
        backgroundColor: name === selected ? "lightgray" : "#eee",
        padding: "1rem 2rem",
        borderRadius: "20px",
        justifyContent: "center",
        alignItems: "center",

        margin: "0.5rem 0.7rem",
        boxShadow: "3px 5px 5px rgba(0,0,0,0.5)",
      }}
    >
      <h4 className="capitalize">{name}</h4>
    </div>
  );
};

export default CategoryScrollItem;
