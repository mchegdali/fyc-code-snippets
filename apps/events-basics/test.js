import EventEmitter from "node:events";
import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200);
  res.end("Hello World\n");
});

console.log(server instanceof EventEmitter);
