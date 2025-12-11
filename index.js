import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const SNAPCHAT_ENDPOINT = "https://tr.snapchat.com/v3/f29f749c-f4d4-4e4f-a4a6-e1607975fe0d/events";
const SNAPCHAT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzY1MzAxNDEwLCJzdWIiOiJhMTNjODk2My0zNTBlLTQ0YTgtOTdmYS1hZDE1NmZmNzQwYjB-UFJPRFVDVElPTn4zNjJjOWVlMy1iNmE1LTQ1NTItYjc3Ni1kM2NjZDk0OGJkN2MifQ.XPqvIsp518PONvS3F2uOOViwaAMM1w6rmVrnlN9dcnw";

app.get("/", (req, res) => res.send("OK"));

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body || {};
    const payload = {
      data: [{
        event_name: "SIGN_UP",
        action_source: "website",
        event_source_url: body.url || "https://www.tau-trades.fwh.is/tautrades",
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          user_agent: req.headers["user-agent"] || "",
          client_ip_address: req.ip || req.connection.remoteAddress || ""
        },
        custom_data: {
          event_id: `snap-${Date.now()}`,
          value: 0.90,
          currency: "USD"
        }
      }]
    };

    const r = await fetch(SNAPCHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SNAPCHAT_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    return res.status(200).json({ ok: true, snap_status: r.status, snap_body: text });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
