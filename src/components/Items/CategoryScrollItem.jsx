import React from "react";

const CategoryScrollItem = ({ id, name, selected, onClick }) => {
  return (
    <div
      onClick={onClick}

      style={{
        display: "flex",
        height: "3rem",
        backgroundColor: id === selected ? "gray" : "#eee",
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
