import express from "express";
import "dotenv/config";
import cors from "cors";
import connectToDB from "./src/config/db.js";
import chatRoutes from "./src/routes/chat.js"
import authRoutes from "./src/routes/authRoutes.js";
import { errorHandler } from "./src/middlewares/errorMiddleware.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

connectToDB();

app.use("/", chatRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on the port ${port}`);
});