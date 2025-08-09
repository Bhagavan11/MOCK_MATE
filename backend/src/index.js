import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/api/interviews', interviewRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Mock Interview Backend is Running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at: http://localhost:${PORT}`);
});
