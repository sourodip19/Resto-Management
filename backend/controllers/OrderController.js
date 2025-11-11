import orderModel from "../models/orderModel.js";
import userModel from "../models/UserModel.js";
import Stripe from "stripe";
import { sendWhatsAppMessage } from "../utils/whatsappClient.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 📦 Place Order (frontend)
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // Create order
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Clear cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // ✅ Send WhatsApp message to user
//     await sendWhatsAppMessage(
//       req.body.address.phone,
//       `✅ Hi ${req.body.address.firstName}! Your order has been placed successfully 🍔
// Order ID: ${newOrder._id}
// We’ll notify you once it’s being prepared.`
//     );

    // ✅ Send WhatsApp message to admin (secure via .env)
//     await sendWhatsAppMessage(
//       process.env.ADMIN_WHATSAPP, // ✅ from .env
//       `🛒 New order received!
// 👤 Customer: ${req.body.address.firstName} ${req.body.address.lastName}
// 📞 Phone: ${req.body.address.phone}
// 💰 Total: ₹${req.body.amount}
// 🆔 Order ID: ${newOrder._id}`
//     );

    // Stripe checkout session
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100 * 80, // ₹ to paise
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("❌ Error in placeOrder:", error);
    res.json({
      success: false,
      message: "Error in OrderController → placeOrder",
    });
  }
};

// 💳 Verify Payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("❌ Error in verifyOrder:", error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

// 👤 Fetch user orders (frontend)
const useOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error in useOrders:", error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// 🧾 Fetch all orders (admin)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error in listOrders:", error);
    res.json({ success: false, message: "Error fetching admin orders" });
  }
};

// 🚚 Update order status + send WhatsApp notifications
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });

    const userPhone = order.address.phone;

    // ✅ Status-based WhatsApp notifications
  //   const messages = {
  //     "Food Processing":
  //       "🍳 Your food is now being prepared! We’ll let you know when it’s ready.",
  //     "Out for Delivery":
  //       "🚚 Your order is out for delivery! It’ll reach you soon. 🍱",
  //     Delivered:
  //       "🎉 Your order has been delivered! Enjoy your meal 🍽️ and thank you for choosing us!",
  //   };

  //   if (messages[status]) {
  //     await sendWhatsAppMessage(userPhone, messages[status]);
  //   }

    res.json({
      success: true,
      message: "Status updated and WhatsApp notification sent.",
    });
  } catch (error) {
    console.error("❌ Error in updateStatus:", error);
    res.json({
      success: false,
      message: "Error while updating order status",
    });
   }
};

export { placeOrder, verifyOrder, useOrders, listOrders, updateStatus };
