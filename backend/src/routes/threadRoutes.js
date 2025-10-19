import express from "express";
import { auth } from "../middlewares/authMiddleware.js";
import { createThread, getThreads, getThread, deleteThread } from "../controllers/threadController.js";

const router = express.Router();

router.post("/", auth, createThread);
router.get("/", auth, getThreads);
router.get("/:id", auth, getThread);
router.delete("/:id", auth, deleteThread);

export default router;