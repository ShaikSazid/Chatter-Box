import mongoose from "mongoose";
import env from "./config.js";

const connectToDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Mongo connection error:", err);
    }
};

console.log("MONGO_URI:", env.MONGO_URI);

export default connectToDB;