import config from "./config.js";
import express from "express";
import brokerClient from "./broker-client.js";

const app = express();
app.use(express.json());

app.post("/publish", async (req, res) => {
  const { channel, message } = req.body;
  await brokerClient.publish(channel, message);

  return res.status(202).end();
});

app.listen(config.PORT, () => {
  console.log(`Publisher actif sur http://localhost:${config.PORT}`);
});
