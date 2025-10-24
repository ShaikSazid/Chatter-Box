import cors from "cors";
import express from "express";
import "dotenv/config";

import cookieParser from "cookie-parser";
import connectToDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import threadRoutes from "./src/routes/threadRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import { errorHandler } from "./src/middlewares/errorMiddleware.js";

const app = express();
const port = process.env.PORT || 5050;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectToDB();

app.use("/auth", authRoutes);
app.use("/threads", threadRoutes);
app.use("/messages", messageRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on the port ${port}`);
});