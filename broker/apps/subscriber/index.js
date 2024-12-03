import config from "./config.js";
import express from "express";
import brokerClient from "../publisher/broker-client.js";

const app = express();
app.use(express.json());

const KNOWN_CHANNELS = ["logs", "notifications"];

const LOG_LEVELS = ["info", "warn", "error"];

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

  if (!KNOWN_CHANNELS.includes(channel)) {
    res.write(`Vous êtes abonné au canal : ${channel}\n\n`);
  }

  const callback = (message) => {
    let body = "";

    if (KNOWN_CHANNELS.includes(channel)) {
      switch (channel) {
        case "logs":
          const randomLogLevel =
            LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)];
          body = JSON.stringify({
            level: randomLogLevel,
            ts: Date.now(),
            message,
            channel,
          });
          break;
        default:
          body = JSON.stringify({ channel, message });
      }
    } else {
      body = JSON.stringify({ channel, message });
    }

    res.write(`data: ${body}\n\n`);
  };

  await brokerClient.subscribe(channel, callback);

  req.on("close", async () => {
    await brokerClient.unsubscribe(channel, callback);
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
