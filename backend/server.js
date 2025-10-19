import cors from "cors";
import express from "express";
import "dotenv/config";

import cookieParser from "cookie-parser";
import connectToDB from "./src/config/db.js";
// import chatRoutes from "./src/routes/chat.js"
import authRoutes from "./src/routes/authRoutes.js";
import threadRoutes from "./src/routes/threadRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import { errorHandler } from "./src/middlewares/errorMiddleware.js";

const app = express();
const port = process.env.PORT;


const allowedOrigins = [
    "http://localhost:5173", // Your local frontend
    "https://inferably-cystocarpic-miquel.ngrok-free.dev" // Your ngrok URL
];

app.use(cors({
  origin: ["http://localhost:5173", "https://inferably-cystocarpic-miquel.ngrok-free.dev"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow DELETE and OPTIONS
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectToDB();

// app.use("/", chatRoutes);
app.use("/auth", authRoutes);
app.use("/threads", threadRoutes);
app.use("/messages", messageRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on the port ${port}`);
});