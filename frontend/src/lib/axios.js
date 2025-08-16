// ✅ src/lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://mock-mate-ro7k.onrender.com",
  // baseURL:"http://localhost:5000"
});
