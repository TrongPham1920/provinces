require("dotenv").config();
const express = require("express");
const axios = require("axios");
const https = require("https");
const cors = require("cors");

const app = express();
app.use(cors());

const BASE_URL = process.env.BASE_URL;
const SELF_URL = process.env.SELF_URL;
const PORT = process.env.PORT || 4000;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

app.get("/api/ping", (req, res) => res.status(200).send("pong"));

app.get("/api/provinces", async (req, res) => {
  try {
    const response = await axiosInstance.get("/?depth=1");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching provinces:", error.message);
    res.status(500).json({ error: "Failed to fetch provinces" });
  }
});

app.get("/api/districts/:provinceId", async (req, res) => {
  try {
    const { provinceId } = req.params;
    const response = await axiosInstance.get(`/p/${provinceId}?depth=2`);
    res.json(response.data?.districts || []);
  } catch (error) {
    console.error("Error fetching districts:", error.message);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
});

app.get("/api/wards/:districtId", async (req, res) => {
  try {
    const { districtId } = req.params;
    const response = await axiosInstance.get(`/d/${districtId}?depth=2`);
    res.json(response.data?.wards || []);
  } catch (error) {
    console.error("Error fetching wards:", error.message);
    res.status(500).json({ error: "Failed to fetch wards" });
  }
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
