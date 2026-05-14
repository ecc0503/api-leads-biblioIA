import "dotenv/config";
import express from "express";
import { leadsLimiter } from "./middleware/rateLimiter.js";
import { validateLead } from "./middleware/validation.js";
import { corsMiddleware as cors } from "./middleware/cors.js";
import { DEFAULTS } from "./config/index.js";

const app = express();

const PORT = DEFAULTS.PORT;
const NODE_ENV = DEFAULTS.NODE_ENV;


app.use(express.json({ limit: "10kb" }));
app.use(cors);

app.post("/api/leads", leadsLimiter, validateLead, async (req, res) => {
  try {
    if (!process.env.WEB3FORMS_KEY) {
      return res.status(500).json({
        success: false,
        message: "WEB3FORMS_KEY is not configured",
      });
    }

    const payload = {
      ...req.body,
      access_key: process.env.WEB3FORMS_KEY,
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : {
          success: false,
          message: "Unexpected response from Web3Forms",
        };

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server on port ${PORT} in ${NODE_ENV} mode`)
);
