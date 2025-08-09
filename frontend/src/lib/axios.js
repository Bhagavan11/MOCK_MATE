// ✅ src/lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mock-mate-ro7k.onrender.com",
});
