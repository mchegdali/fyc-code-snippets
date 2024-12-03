import { EventEmitter } from "node:events";

class PubSubBrokerClient extends EventEmitter {
  constructor({ brokerUrl = "http://localhost:3002", subscriberUrl }) {
    super();
    this.brokerUrl = brokerUrl;
    this.subscriberUrl = subscriberUrl;
  }

  async subscribe(channel, callback) {
    try {
      const response = await fetch(`${this.brokerUrl}/subscribe/${channel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriberUrl: this.subscriberUrl }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "Subscription failed");
      }

      const data = await response.json();
      this.on(channel, callback);
      console.log(`Subscribed to channel: ${channel}`, data);

      return data.recentMessages || [];
    } catch (error) {
      console.error(
        `Subscription failed for channel ${channel}:`,
        error.message
      );
      throw error;
    }
  }

  async unsubscribe(channel, callback) {
    try {
      const response = await fetch(`${this.brokerUrl}/unsubscribe/${channel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriberUrl: this.subscriberUrl }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "Unsubscription failed");
      }

      const data = await response.json();
      this.removeListener(channel, callback);
      console.log(`Unsubscribed from channel: ${channel}`, data);
      return data;
    } catch (error) {
      console.error(
        `Unsubscription failed for channel ${channel}:`,
        error.message
      );
      throw error;
    }
  }

  async publish(channel, message) {
    try {
      const response = await fetch(`${this.brokerUrl}/publish/${channel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "Publishing failed");
      }

      const data = await response.json();
      console.log(`Message published to channel ${channel}:`, data);
      this.emit(channel, message);
      return data;
    } catch (error) {
      console.error(`Publishing failed for channel ${channel}:`, error.message);
      throw error;
    }
  }
}

export default PubSubBrokerClient;
