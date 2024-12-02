import PubSubBrokerClient from "../../common/PubSubBrokerClient.js";

const brokerClient = new PubSubBrokerClient({
  subscriberUrl: "http://localhost:3000",
});

export default brokerClient;
