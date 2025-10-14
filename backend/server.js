import express from "express";
import "dotenv/config";
import cors from "cors";
import connectToDB from "./src/config/db.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

connectToDB();

app.listen(port, () => {
    console.log(`Server running on the port ${port}`);
});