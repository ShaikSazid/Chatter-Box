import express from "express";
import Thread from "../models/threadModel.js";

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const newThread = new Thread({
            threadId: "xyz",
            title: "Testing new thread"
        });
        const response = await newThread.save();
        console.log(response);
        res.send(response);
    } catch (err) {
        console.error(err);
        res.status(500).json("Failed to created new error: ", err);
    }
});

export default router;