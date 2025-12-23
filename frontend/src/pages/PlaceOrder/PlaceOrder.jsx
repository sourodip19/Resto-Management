import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    // 🧺 Build order items
    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 20,
    };

    try {
      const res = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      // 🔍 DEBUG (keep for now)
      console.log("FULL BACKEND RESPONSE 👉", res.data);
      console.log("KEY RECEIVED 👉", res.data.key, typeof res.data.key);

      if (!res.data.success) {
        alert("Order creation failed");
        return;
      }

      if (!res.data.key) {
        alert("Razorpay key missing from backend");
        return;
      }

      // ✅ Razorpay options (DEFENSIVE)
      const options = {
        key: String(res.data.key), // 🔥 FORCE STRING
        amount: res.data.amount,
        currency: "INR",
        name: "FoodHub",
        description: "Food Order Payment",
        order_id: res.data.razorpayOrderId,

        handler: async function (response) {
          await axios.post(url + "/api/order/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: res.data.orderId,
          });

          navigate("/myorders");
        },

        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },

        theme: {
          color: "#000000",
        },
      };
// 🔍 DEBUG Razorpay options
console.log("OPTIONS CHECK 👉", {
  key: options.key,
  amount: options.amount,
  order_id: options.order_id,
});

      // 🚀 Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  };

  // 🔐 Protect route
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required type="text" placeholder="First name" name="firstName" value={data.firstName} onChange={onChangeHandler} />
          <input required type="text" placeholder="Last name" name="lastName" value={data.lastName} onChange={onChangeHandler} />
        </div>

        <input required type="email" placeholder="Email Address" name="email" value={data.email} onChange={onChangeHandler} />
        <input required type="text" placeholder="Street" name="street" value={data.street} onChange={onChangeHandler} />

        <div className="multi-fields">
          <input required type="text" placeholder="City" name="city" value={data.city} onChange={onChangeHandler} />
          <input required type="text" placeholder="State" name="state" value={data.state} onChange={onChangeHandler} />
        </div>

        <div className="multi-fields">
          <input required type="text" placeholder="Zip Code" name="zipcode" value={data.zipcode} onChange={onChangeHandler} />
          <input required type="text" placeholder="Country" name="country" value={data.country} onChange={onChangeHandler} />
        </div>

        <input required type="text" placeholder="Phone" name="phone" value={data.phone} onChange={onChangeHandler} />
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 20}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</b>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
