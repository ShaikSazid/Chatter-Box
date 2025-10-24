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
const port = process.env.PORT || 8080;

const allowedOrigins = [
  "http://localhost:5173",        
  process.env.CLIENT_URL || ""    
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

connectToDB();

app.get("/", (req, res) => {
  res.send("Server is running man");
});

app.use("/auth", authRoutes);
app.use("/threads", threadRoutes);
app.use("/messages", messageRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});