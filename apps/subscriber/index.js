import Subscriber from "./Subscriber.js";

const subscriber1 = new Subscriber("Abonné 1");
const subscriber2 = new Subscriber("Abonné 2");

subscriber1.subscribe("news");
subscriber1.subscribe("sports");

subscriber2.subscribe("sports");
subscriber2.subscribe("cinema");
