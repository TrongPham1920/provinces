require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const BASE_URL = process.env.BASE_URL;
const SELF_URL = process.env.SELF_URL;

// ✅ Lấy danh sách tỉnh/thành
app.get("/api/provinces", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/?depth=1`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching provinces:", error.message);
    res.status(500).json({ error: "Failed to fetch provinces" });
  }
});

// ✅ Lấy danh sách quận/huyện theo tỉnh
app.get("/api/districts/:provinceId", async (req, res) => {
  try {
    const { provinceId } = req.params;
    const response = await axios.get(`${BASE_URL}/p/${provinceId}?depth=2`);
    res.json(response.data?.districts || []);
  } catch (error) {
    console.error("Error fetching districts:", error.message);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
});

// ✅ Lấy danh sách phường/xã theo huyện
app.get("/api/wards/:districtId", async (req, res) => {
  try {
    const { districtId } = req.params;
    const response = await axios.get(`${BASE_URL}/d/${districtId}?depth=2`);
    res.json(response.data?.wards || []);
  } catch (error) {
    console.error("Error fetching wards:", error.message);
    res.status(500).json({ error: "Failed to fetch wards" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);

  setInterval(async () => {
    try {
      const res = await axios.get(`${SELF_URL}/api/ping`);
      console.log(`🔁 Self-ping success: ${res.status}`);
    } catch (err) {
      console.error(`❌ Self-ping failed: ${err.message}`);
    }
  }, 5 * 60 * 1000);
});
