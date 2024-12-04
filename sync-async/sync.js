import fs from "node:fs";

const readDevRandomFile = fs.readFileSync("/dev/random", "utf8");

console.log(readDevRandomFile.slice(0, 10));

console.log("autre process lancé");
console.log("un autre process lancé");
console.log("encore un autre process lancé");
