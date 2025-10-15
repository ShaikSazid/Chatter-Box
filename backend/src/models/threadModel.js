import mongoose from "mongoose";
import MessageSchema from "./messageModel.js";

const ThreadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema],
}, { timestamps: true });

export default mongoose.model("Thread", ThreadSchema);