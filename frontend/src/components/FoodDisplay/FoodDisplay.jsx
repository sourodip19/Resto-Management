import React, { useContext, useEffect } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, hasMore, fetchMoreFood, loadingMore, fetchFoodList } =
    useContext(StoreContext);

  // 👈 whenever category changes, refetch from backend
  useEffect(() => {
    fetchFoodList(category);
  }, [category]);

  return (
    <div className="food-display" id="food_display">
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {food_list.map((item) => (       // 👈 no more frontend filtering needed
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
          />
        ))}
      </div>

      {hasMore && (
        <button
          className="view-more-btn"
          onClick={fetchMoreFood}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading..." : "View More"}
        </button>
      )}

      {food_list.length === 0 && !loadingMore && (
        <p className="no-items-text">No items found in this category.</p>
      )}
    </div>
  );
};

export default FoodDisplay;