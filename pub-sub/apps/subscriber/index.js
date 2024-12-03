import config from "./config.js";
import express from "express";
import brokerClient from "../publisher/broker-client.js";

const app = express();
app.use(express.json());

app.get("/subscribe", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const channel = url.searchParams.get("channel");

  if (!channel) {
    res.status(400).json({ error: "Canal non spécifié" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const channelCallback = (message) => {
    const body = JSON.stringify({ channel, message });

    res.write(`data: ${body}\n\n`);
  };

  await brokerClient.subscribe(channel, channelCallback);

  req.on("close", async () => {
    await brokerClient.unsubscribe(channel, channelCallback);
    console.log(`Un abonné a quitté le canal : ${channel}`);
    res.end();
  });
});

app.post("/notify", (req, res) => {
  const { channel, message } = req.body;

  if (!channel || !message) {
    res.status(422).json({ error: "Canal ou message manquant" });
    return;
  }

  brokerClient.emit(channel, message);

  console.log(`Message reçu sur le canal ${channel}:`, message);

  res.status(200).end();
});

app.listen(config.PORT, () => {
  console.log(`Subscriber actif sur http://localhost:${config.PORT}`);
});
