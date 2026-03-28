import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, hasMore, fetchMoreFood, loadingMore } = useContext(StoreContext);

  const filteredList = food_list.filter(
    (item) => category === "All" || category === item.category
  );

  return (
    <div className="food-display" id="food_display">
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {filteredList.map((item) => (
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

      {/* Show "View More" only if there are more items AND current category has matches */}
      {hasMore && (
        <button
          className="view-more-btn"
          onClick={fetchMoreFood}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading..." : "View More"}
        </button>
      )}

      {/* No items found for this category */}
      {filteredList.length === 0 && !loadingMore && (
        <p className="no-items-text">No items found in this category.</p>
      )}
    </div>
  );
};

export default FoodDisplay;