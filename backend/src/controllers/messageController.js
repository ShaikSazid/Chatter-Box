import Thread from "../models/threadModel.js";
import { getAiResponse, generateTitle } from "../services/aiService.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { threadId, content } = req.body;

    if (!threadId) {
      return res.status(400).json({ msg: "threadId is required" });
    }

    const thread = await Thread.findOne({ _id: threadId, userId: req.user.id });
    if (!thread) return res.status(404).json({ msg: "Thread not found" });

    const isNewChat = thread.messages.length === 0;

    // Add user message
    thread.messages.push({ role: "user", content });

    // Get AI response
    const assistantResponse = await getAiResponse(thread.messages);
    thread.messages.push({ role: "assistant", content: assistantResponse });

    // Generate title if first message
    if (isNewChat) {
      const title = await generateTitle(content, assistantResponse);
      thread.title = title;
    }

    await thread.save();

    res.status(200).json({
      assistantResponse,
      newTitle: isNewChat ? thread.title : null
    });

  } catch (err) {
    next(err);
  }
};
