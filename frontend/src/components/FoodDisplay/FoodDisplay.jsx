import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  console.log("Food list from context:", food_list);
  return (
    <div className="food-display" id="food_display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item) =>
          category == "All" || category === item.category ? (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
