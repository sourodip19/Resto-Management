import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://sourodipdey19_db_user:NeUz3mgIWT6RgLPr@cluster2.wqcz5qq.mongodb.net/Resturent-Management"
    )
    .then(() => console.log("DB Connected"));
};
