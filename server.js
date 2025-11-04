require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const BASE_URL = process.env.BASE_URL || "https://api.vnappmob.com/api/v2";
const SELF_URL = process.env.SELF_URL;
const PORT = process.env.PORT || 4000;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// API kiểm tra ping
app.get("/api/ping", (req, res) => res.status(200).send("pong"));

// Lấy danh sách tỉnh/thành
app.get("/api/provinces", async (req, res) => {
  try {
    const response = await axiosInstance.get("/province");
    res.json(response.data?.results || []);
  } catch (error) {
    console.error("Error fetching provinces:", error.message);
    res.status(500).json({ error: "Failed to fetch provinces" });
  }
});

// Lấy danh sách quận/huyện theo ID tỉnh
app.get("/api/districts/:provinceId", async (req, res) => {
  try {
    const { provinceId } = req.params;
    const response = await axiosInstance.get(
      `/province/district/${provinceId}`
    );
    res.json(response.data?.results || []);
  } catch (error) {
    console.error("Error fetching districts:", error.message);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
});

// Lấy danh sách phường/xã theo ID quận/huyện
app.get("/api/wards/:districtId", async (req, res) => {
  try {
    const { districtId } = req.params;
    const response = await axiosInstance.get(`/province/ward/${districtId}`);
    res.json(response.data?.results || []);
  } catch (error) {
    console.error("Error fetching wards:", error.message);
    res.status(500).json({ error: "Failed to fetch wards" });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);

  // Tự động ping bản thân mỗi 5 phút
  setInterval(async () => {
    try {
      const res = await axios.get(`${SELF_URL}/api/ping`);
      console.log(`🔁 Self-ping success: ${res.status}`);
    } catch (err) {
      console.error(`❌ Self-ping failed: ${err.message}`);
    }
  }, 5 * 60 * 1000);
});
