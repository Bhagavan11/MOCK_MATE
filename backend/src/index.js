import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
//hi just debugging git
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://mock-mate-bhagavan.vercel.app'
  ],
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
