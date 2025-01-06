import { EventEmitter } from "node:events";
import readline from "node:readline";

const emitter = new EventEmitter();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

emitter.on("connect", () => {
  console.log("Connexion établie !");
});

emitter.on("disconnect", () => {
  console.log("Déconnexion !");
});

rl.on("line", (input) => {
  if (input.trim().toLowerCase() === "ok") {
    emitter.emit("connect");
  } else if (input.trim().toLowerCase() === "bye") {
    emitter.emit("disconnect");
    rl.close();
    process.exit(0);
  } else {
    console.log("Input not recognized. Type 'ok' to connect.");
  }
});
