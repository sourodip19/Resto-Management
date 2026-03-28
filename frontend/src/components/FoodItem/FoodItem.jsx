import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

// Injects optimization params for old items without upload-time transforms
const optimizeImage = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_400/");
};

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const quantity = cartItems?.[id] || 0;
  const imageUrl = image?.startsWith("http")
    ? optimizeImage(image)        // 👈 Cloudinary URL — optimize it
    : `${url}/images/${image}`;   // 👈 local URL — leave it as is

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          src={imageUrl}
          alt={name}
          className="food-item-image"
          loading="lazy"            // 👈 native lazy load
        />

        {quantity === 0 ? (
          <img
            className="add"
            src={assets.add_icon_white}
            alt="Add"
            onClick={() => addToCart(id)}
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              alt="Remove"
              onClick={() => removeFromCart(id)}
            />
            <p>{quantity}</p>
            <img
              src={assets.add_icon_green}
              alt="Add"
              onClick={() => addToCart(id)}
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;