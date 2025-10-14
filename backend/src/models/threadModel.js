import mongoose from "mongoose";
import MessageSchema from "./messageModel.js";

const ThreadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ThreadSchema.pre("save", async function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("Thread", ThreadSchema);