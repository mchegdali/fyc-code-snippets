import { EventEmitter } from "node:events";
import readline from "node:readline";

const emitter = new EventEmitter();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

emitter.on("input", (value) => {
  console.log("oninput", value);
});

rl.on("line", (input) => {
  emitter.emit("input", input);
});
