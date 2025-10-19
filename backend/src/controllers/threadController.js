import Thread from "../models/threadModel.js";

export const getThreads = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const threads = await Thread.find({ userId }).select("title").sort({ updatedAt: -1 });
        res.status(200).json(threads);
    } catch (err) {
        next(err);
    }
}

export const getThread = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const thread = await Thread.findOne({ _id: id, userId }).populate("messages");
        if(!thread) return res.status(404).json({ msg: "Thread not found" });
        res.status(200).json(thread);
    } catch (err) {
        next(err);
    }
}

export const createThread = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const newThread = new Thread({ userId });
        await newThread.save();
        return res.status(201).json({ msg: "New thread created", newThread });
    } catch (err) {
        next(err);
    }
}

export const deleteThread = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await Thread.deleteOne({ _id: id, userId });
        if(result.deletedCount === 0) return res.status(404).json({ msg: "Thread not found or not authorized" });
        return res.status(200).json({ msg: "Thread deleted" });
    } catch (err) {
        next(err);
    }
}