import Thread from "../models/threadModel.js";
import { getAiResponse, generateTitle } from "../services/aiService.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { threadId, content } = req.body;
        let thread;
        let newTitle;

        if (threadId) {
            thread = await Thread.findOne({ _id: threadId, userId: req.user.id });
            if (!thread) return res.status(404).json({ msg: "Thread not found" });
        } else {
            // This case is not used by the current frontend but is good practice to handle.
            thread = new Thread({ userId: req.user.id });
        }

        // Check if this is the first user message in a new chat
        const isNewChat = thread.messages.length === 0;

        thread.messages.push({ role: "user", content });

        const assistantResponse = await getAiResponse(thread.messages);
        thread.messages.push({ role: "assistant", content: assistantResponse });

        // If it's a new chat, generate a title
        if (isNewChat) {
            const title = await generateTitle(content, assistantResponse);
            thread.title = title;
            newTitle = title;
        }

        await thread.save();

        // Send back the structured response the frontend expects
        res.status(200).json({ assistantResponse, newTitle });
    } catch (err) {
        next(err);
    }
};
