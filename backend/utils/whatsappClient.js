import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "resto-admin", // stable session
  }),
  puppeteer: {
    headless: false, // 🔥 REQUIRED
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});
const normalizeNumber = (number) => {
  return number
    .toString()
    .replace(/\D/g, "")      // remove non-digits
    .replace(/^0+/, "")      // remove leading zeros
    .startsWith("91")
      ? number
      : `91${number}`;
};

// QR
client.on("qr", (qr) => {
  console.log("\n📱 Scan this QR in WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// Ready
client.on("ready", () => {
  console.log("✅ WhatsApp client is READY");
});

// Auth success
client.on("authenticated", () => {
  console.log("🔐 WhatsApp authenticated");
});

// Auth failure
client.on("auth_failure", (msg) => {
  console.error("❌ Auth failure:", msg);
});

// Disconnect
client.on("disconnected", (reason) => {
  console.error("⚠️ WhatsApp disconnected:", reason);
});

// Init
client.initialize();

// Send message util

export const sendWhatsAppMessage = async (number, message) => {
  try {
    const formatted = normalizeNumber(number);
    const chatId = `${formatted}@c.us`;
    await client.sendMessage(chatId, message);
    console.log(`📤 WhatsApp sent → ${formatted}`);
  } catch (err) {
    console.error("❌ WhatsApp send failed:", err.message);
  }
};


export default client;
