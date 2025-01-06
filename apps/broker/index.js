import MessageBroker from "./MessageBroker.js";

const broker = new MessageBroker(3000);
broker.listen();
