import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import qrcode from "qrcode-terminal";

// Initialize client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// Display QR code for first-time authentication
client.on("qr", (qr) => {
  console.log("\n📱 Scan this QR to connect WhatsApp:");
  console.log("═══════════════════════════════════");
  qrcode.generate(qr, { small: true });
  console.log("═══════════════════════════════════");
});

// When WhatsApp is ready
client.on("ready", () => console.log("✅ WhatsApp client is ready!"));

// Handle re-auth / session issues
client.on("authenticated", () => console.log("🔐 WhatsApp authenticated!"));
client.on("auth_failure", (msg) =>
  console.error("❌ Authentication failed:", msg)
);
client.on("disconnected", (reason) => {
  console.error("⚠️ WhatsApp disconnected:", reason);
  console.log("🔄 Reconnecting...");
  client.initialize();
});

// Start WhatsApp session
client.initialize();

// ✅ Utility function to send messages
export const sendWhatsAppMessage = async (number, message) => {
  try {
    // Ensure number is in correct format (no +, just 91XXXXXXXXXX)
    const formatted = `${number}@c.us`;
    await client.sendMessage(formatted, message);
    console.log(`📤 WhatsApp message sent to ${number}`);
  } catch (err) {
    console.error(
      `❌ Failed to send WhatsApp message to ${number}:`,
      err.message
    );
  }
};

export default client;
