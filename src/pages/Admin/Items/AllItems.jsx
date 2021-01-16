import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../../reduxStore/actions/itemsActions";

import Loader from "../../../components/Loader";
import CardItem from "../../../components/Items/CardItem";
const AllItems = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.itemsData);

  useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  if (loading) return <Loader />;
  return (
    <div>
      {items.map((item) => (
        <CardItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default AllItems;
