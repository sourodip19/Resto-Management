import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Order.css";
import { toast } from "react-toastify";
import { keyBy } from "lodash";
import { assets } from "../../../../frontend/src/assets/frontend_assets/assets";
const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    const res = await axios.get(url + "/api/order/list");
    if (res.data) {
      setOrders(res.data.data);
    } else {
      toast.error("Error");
    }
  };

  const statusHandler = async (e, orderId) => {
    const res = await axios.post(url + "/api/order/status", {
      orderId,
      status: e.target.value,
    });
    if (res.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="parcel" />

            <div className="order-item-details">
              <p className="order-item-food">
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>

              <p className="order-item-amount">${order.amount}</p>
              <p className="order-item-count">Items: {order.items.length}</p>

              <p
                className={`order-item-status ${
                  order.status === "Delivered"
                    ? "status-delivered"
                    : order.status === "Out for Delivery"
                    ? "status-out"
                    : "status-processing"
                }`}
              >
                ● {order.status}
              </p>

              <button className="track-btn">Track Order</button>

              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Order;
