import { EventEmitter } from "node:events";
import readline from "node:readline";
import Publisher from "./Publisher.js";

const publisher = new Publisher();

const emitter = new EventEmitter();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

emitter.on(
  "message",
  /**
   *
   * @param {`${string}:${string}`} message Message to publish
   */
  async (message) => {
    console.log(message);
    const [topic, ...contentParts] = message.split(":");
    await publisher.publishMessage(topic, contentParts.join(":"));
    displayPrompt();
  }
);

rl.on("line", (input) => {
  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) {
    displayPrompt();
    return;
  }

  if (trimmedInput.toLowerCase() === "exit") {
    handleExit();
  }

  if (!trimmedInput.includes(":")) {
    console.warn("Veuillez saisir un message au format 'topic:contenu'");
    displayPrompt();
    return;
  }

  emitter.emit("message", trimmedInput);
});

rl.on("SIGINT", () => {
  handleExit();
});

function handleExit() {
  console.log("\nGoodbye!");
  rl.close();
  process.exit(0);
}

function displayPrompt() {
  process.stdout.write("> ");
}

console.log("\n=== Message Publisher ===");
console.log("Saisissez un message au format 'topic:contenu'");
console.log("Tapez 'exit' pour quitter le programme ou utilisez Ctrl-C\n");
displayPrompt();
