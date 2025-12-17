import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://sourodipdey19_db_user:sourodipdey131205@cluster2.wqcz5qq.mongodb.net/Resturent-Management"
    )
    .then(() => console.log("DB Connected"));
};
