import crypto from "node:crypto";
import express from "express";

class PubSubBrokerServer {
  #state;
  #app;

  constructor() {
    this.#state = this.#createInitialState();
    this.#app = express();
    this.#app.use(express.json());

    this.#app.post("/publish/:channel", this.#publishMessageHandler.bind(this));
    this.#app.post("/subscribe/:channel", this.#subscribeHandler.bind(this));
    this.#app.post(
      "/unsubscribe/:channel",
      this.#unsubscribeHandler.bind(this)
    );
    this.#app.get("/messages/:channel", this.#getMessagesHandler.bind(this));
  }

  #createInitialState() {
    return { channels: {}, messages: {} };
  }

  #subscribeTo(channel, subscriberUrl) {
    if (!this.#state.channels[channel]) {
      this.#state.channels[channel] = [];
    }

    if (!this.#state.channels[channel].includes(subscriberUrl)) {
      this.#state.channels[channel].push(subscriberUrl);
    }
  }

  #publishMessage(channel, messageEntry) {
    this.#state.messages[channel] = [
      ...(this.#state.messages[channel] || []),
      messageEntry,
    ];
  }

  #unsubscribeFrom(channel, subscriberUrl) {
    this.#state.channels[channel] = this.#state.channels[channel]
      ? this.#state.channels[channel].filter((url) => url !== subscriberUrl)
      : [];
  }

  async #notifySubscribers(subscribers, channel, messageEntry) {
    console.log("Notification de la liste de subscribers", subscribers);
    console.log(
      "PubSubBrokerServer/notifySubscribers/messageEntry",
      messageEntry
    );

    const notifications = subscribers.map((subscriberUrl) =>
      fetch(`${subscriberUrl}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          message: messageEntry.data,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            console.error("Notification failed", response.status);
            const errorBody = await response.json();
            console.error("Notification failed", errorBody.error);
          } else {
            console.log("Notification succeeded", response.status);
          }
        })
        .catch(console.error)
    );

    await Promise.allSettled(notifications);
  }

  async #publishMessageHandler(req, res) {
    const { channel } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const messageEntry = {
      id: crypto.randomUUID(),
      data: message,
      timestamp: Date.now(),
    };

    this.#publishMessage(channel, messageEntry);

    const subscribers = this.#state.channels[channel] || [];
    await this.#notifySubscribers(subscribers, channel, messageEntry);

    res.status(200).json({
      status: "Message published",
      messageId: messageEntry.id,
      channel,
    });
  }

  #subscribeHandler(req, res) {
    const { channel } = req.params;
    const { subscriberUrl } = req.body;

    if (!subscriberUrl) {
      return res.status(400).json({ error: "Subscriber URL is required" });
    }

    this.#subscribeTo(channel, subscriberUrl);

    const messageHistory = this.#state.messages[channel] || [];

    res.status(200).json({
      status: "Subscribed",
      channel,
      subscriberUrl,
      recentMessages: messageHistory.slice(-10),
    });
  }

  #unsubscribeHandler(req, res) {
    const { channel } = req.params;
    const { subscriberUrl } = req.body;

    if (!subscriberUrl) {
      return res.status(400).json({ error: "Subscriber URL is required" });
    }

    this.#unsubscribeFrom(channel, subscriberUrl);

    res.status(200).json({
      status: "Unsubscribed",
      channel,
      subscriberUrl,
    });
  }

  #getMessagesHandler(req, res) {
    const { channel } = req.params;
    const { limit = 50 } = req.query;

    const messageHistory = this.#state.messages[channel] || [];
    const limitedHistory = messageHistory.slice(-Number(limit));

    res.status(200).json({
      channel,
      messages: limitedHistory,
    });
  }

  listen(port = 3000) {
    this.#app.listen(port, () => {
      console.log(`Pub/Sub Broker running on port ${port}`);
    });
  }
}

export default PubSubBrokerServer;
