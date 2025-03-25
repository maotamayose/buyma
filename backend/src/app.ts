import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRouter from "./routes/productRouter";
import imageRouter from "./routes/imageRouter";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/product", productRouter);
app.use("/image", imageRouter);

export default app;
