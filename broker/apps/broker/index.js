import PubSubBrokerServer from "../../common/PubSubBrokerServer.js";

const PORT = 3002;
const server = new PubSubBrokerServer();

server.listen(PORT);
