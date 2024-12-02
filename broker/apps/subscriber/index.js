import config from "./config.js";
import express from "express";
import brokerClient from "../publisher/broker-client.js";

const app = express();
app.use(express.json());

app.get("/subscribe", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const channel = url.searchParams.get("channel");

  if (!channel) {
    return res.status(400).json({ error: "Canal non spécifié" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`Vous êtes abonné au canal : ${channel}\n\n`);

  const callback = (message) => {
    res.write(`data: ${JSON.stringify({ channel, message })}\n\n`);
  };

  await brokerClient.subscribe(channel, callback);

  req.on("close", async () => {
    await brokerClient.unsubscribe(channel, callback);
    console.log(`Un abonné a quitté le canal : ${channel}`);
    res.end();
  });
});

app.post("/notify", (req, res) => {
  console.log("subscriber/notify/body", req.body);

  const { channel, message } = req.body;

  if (!channel || !message) {
    return res.status(400).json({ error: "Channel and message are required" });
  }

  console.log(`Message reçu sur le canal ${channel}:`, message);

  // sendToChannel(channel, message);
  res.status(200).end();
});

app.listen(config.PORT, () => {
  console.log(`Subscriber actif sur http://localhost:${config.PORT}`);
});
