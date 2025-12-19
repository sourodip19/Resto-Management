import orderModel from "../models/orderModel.js";
import userModel from "../models/UserModel.js";
import Stripe from "stripe";
import { sendWhatsAppMessage } from "../utils/whatsappClient.js";
import { io } from "../server.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = 
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5174";
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Frontend URL chosen:", frontend_url);
    

/* =========================
   1️⃣ PLACE ORDER (INIT)
========================= */
const placeOrder = async (req, res) => {
  try {
    const order = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      status: "Pending",
    });

    await order.save();

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 20 * 100,
      },
      quantity: 1,
    });
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${frontend_url}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${order._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* =========================
   2️⃣ VERIFY PAYMENT
========================= */
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    const userMessage = `
✅ *Order Confirmed!*

🍔 *Items:*
${order.items.map(i => `• ${i.name} × ${i.quantity}`).join("\n")}

💰 *Paid:* ₹${order.amount}
⏱️ *Estimated time:* 30 minutes

📞 *Restaurant:* ${process.env.OWNER_PHONE}

🆔 *Order ID:* ${order._id}

Thank you for ordering with us! 🙏
`;

const ownerMessage = `
🛒 *NEW ORDER RECEIVED*

👤 *Customer:* ${order.address.firstName} ${order.address.lastName}
📞 *Phone:* ${order.address.phone}
🏠 *Address:* ${order.address.street}, ${order.address.city}

🍔 *Items:*
${order.items.map(i => `• ${i.name} × ${i.quantity}`).join("\n")}

💰 *Amount:* ₹${order.amount}
🆔 *Order ID:* ${order._id}
`;

    
    if (!order) return res.json({ success: false });

    // Prevent duplicate execution
    if (order.payment === true) {
      return res.json({ success: true, message: "Already verified" });
    }

    if (success === "true") {
      order.payment = true;
      order.status = "Food Processing";
      await order.save();

      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      await sendWhatsAppMessage(order.address.phone, userMessage);
      await sendWhatsAppMessage(process.env.ADMIN_WHATSAPP, ownerMessage);
      

      // 🔥 Live update to admin
      io.emit("newOrder", order);

      return res.json({ success: true });
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false });
  } catch (err) {
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
    const orders = await orderModel.find({ userId: req.body.userId });
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
