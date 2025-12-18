import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Order.css";
import { toast } from "react-toastify";
import { assets } from "../../../../frontend/src/assets/frontend_assets/assets";
import { io } from "socket.io-client";

// 🔥 socket connection (outside component)
const socket = io("http://localhost:4000");

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(url + "/api/order/list");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch {
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (e, orderId) => {
    const res = await axios.post(url + "/api/order/status", {
      orderId,
      status: e.target.value,
    });

    if (!res.data.success) {
      toast.error("Failed to update status");
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // ✅ LIVE SOCKET UPDATES
  useEffect(() => {
    // New order received
    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
      toast.success("🛒 New order received");
    });

    // Order status updated
    socket.on("orderStatusUpdate", ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderStatusUpdate");
    };
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

              <p className="order-item-amount">₹{order.amount}</p>
              <p className="order-item-count">
                Items: {order.items.length}
              </p>

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
