import "dotenv/config"; // ensure .env loads

console.log(
  "MONGO_URL raw:",
  process.env.MONGO_URL?.replace(/:[^:@]+@/, ":<redacted>@")
);
