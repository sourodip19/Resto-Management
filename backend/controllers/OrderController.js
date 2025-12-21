import orderModel from "../models/orderModel.js";
import userModel from "../models/UserModel.js";
import { sendWhatsAppMessage } from "../utils/whatsappClient.js";
import { io } from "../server.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const frontend_url = "http://localhost:5174";
  // process.env.NODE_ENV === "production"
  //   ? process.env.FRONTEND_URL
  //   : "http://localhost:5174";
  //   console.log("NODE_ENV:", process.env.NODE_ENV);
  //   console.log("Frontend URL chosen:", frontend_url);
    

/* =========================
   1️⃣ PLACE ORDER (INIT)
========================= */
const placeOrder = async (req, res) => {
  try {
    const order = await orderModel.create({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      status: "Pending",
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: order.amount * 100, // paise
      currency: "INR",
      receipt: order._id.toString(),
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
    
       
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};


/* =========================
   2️⃣ VERIFY PAYMENT
========================= */
const verifyOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Payment verification failed" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false });

    order.payment = true;
    order.status = "Food Processing";
    await order.save();

    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

    // WhatsApp messages (UNCHANGED)
    await sendWhatsAppMessage(order.address.phone, `✅ Order Confirmed!`);
    await sendWhatsAppMessage(process.env.ADMIN_WHATSAPP, `🛒 New Order`);

    io.emit("newOrder", order);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};


/* =========================
   3️⃣ UPDATE STATUS (ADMIN)
========================= */
const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    if (!order || !order.payment)
      return res.json({ success: false });

    order.status = status;
    await order.save();

    const messages = {
      "Food Processing": "🍳 Preparing your food",
      "Out for Delivery": "🚚 Out for delivery",
      Delivered: "🎉 Delivered!",
    };

    if (messages[status]) {
      await sendWhatsAppMessage(order.address.phone, messages[status]);
    }

    // 🔥 Live update to user & admin
    io.emit("orderStatusUpdate", {
      orderId,
      status,
    });

    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
};


// 👤 Fetch user orders (frontend)
const useOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error in useOrders:", error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// 🧾 Fetch all orders (admin)
// ONLY show paid orders to admin
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ payment: true })   // ✅ IMPORTANT
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false });
  }
};

export {
  placeOrder,
  verifyOrder,
  updateStatus,
  useOrders, 
  listOrders,
};
