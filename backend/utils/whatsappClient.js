import "dotenv/config";

let client = null;
let sendWhatsAppMessage = async () => {
  console.log("📵 WhatsApp disabled in production");
};

/* ===============================
   ONLY RUN WHATSAPP LOCALLY
================================ */
if (process.env.NODE_ENV !== "production") {
  const pkg = await import("whatsapp-web.js");
  const qrcode = (await import("qrcode-terminal")).default;

  const { Client, LocalAuth } = pkg.default;

  const normalizeNumber = (number) => {
    const cleaned = number.toString().replace(/\D/g, "").replace(/^0+/, "");
    return cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
  };

  client = new Client({
    authStrategy: new LocalAuth({ clientId: "resto-admin" }),
    puppeteer: {
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    console.log("\n📱 Scan this QR in WhatsApp:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("✅ WhatsApp client READY");
  });

  client.on("authenticated", () => {
    console.log("🔐 WhatsApp authenticated");
  });

  client.on("auth_failure", (msg) => {
    console.error("❌ Auth failure:", msg);
  });

  client.on("disconnected", (reason) => {
    console.error("⚠️ WhatsApp disconnected:", reason);
  });

  client.initialize();

  sendWhatsAppMessage = async (number, message) => {
    try {
      const formatted = normalizeNumber(number);
      const chatId = `${formatted}@c.us`;
      await client.sendMessage(chatId, message);
      console.log(`📤 WhatsApp sent → ${formatted}`);
    } catch (err) {
      console.error("❌ WhatsApp send failed:", err.message);
    }
  };
}

export { sendWhatsAppMessage };
export default client;
