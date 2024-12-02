import { EventEmitter } from "node:events";
const emitter = new EventEmitter();

emitter.on("connect", () => {
  console.log("Connexion établie !");
});

emitter.emit("connect");
