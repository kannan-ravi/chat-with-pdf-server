import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();

import uploadRouter from "./routes/upload.route.js";
import chatRouter from "./routes/chat.route.js";
import errorHandler from "./middleware/error.middleware.js";

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("uploads"));

app.use("/upload", uploadRouter);
app.use("/chat", chatRouter);

app.use(errorHandler.defaultErrorHandle);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
