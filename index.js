import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

// Snapchat webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("Snapchat Webhook Received:");
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).send("Received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
