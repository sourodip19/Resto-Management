import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Add / Remove</p>
        </div>

        <hr />

        {food_list.map((item) => {
          if (cartItems && cartItems[item._id] > 0) {
            return (
              <div className="cart-items-item" key={item._id}>
                <img
                  src={url+"/images/"+item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>${item.price * cartItems[item._id]}</p>
                <div className="quantity-controls">
                  <button onClick={() => addToCart(item._id)}>+</button>
                  <button onClick={() => removeFromCart(item._id)}>-</button>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-summary">
        {/* LEFT SIDE - Cart Total */}
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
            <button onClick={() => navigate("/order")}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - Promo Code */}
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here:</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder="Promo code" />
            <button>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
