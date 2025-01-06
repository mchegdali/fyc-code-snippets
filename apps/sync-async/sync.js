import fs from "node:fs";
import crypto from "node:crypto";

// Version synchrone (bloquante)
// Création d'un fichier temporaire volumineux pour démontrer le blocage
function createBigFile() {
  const tempFile = "temp-large-file.txt";

  // Génération d'une grande quantité de données aléatoires
  console.log("Génération de la donnée...");
  const largeData = crypto.randomBytes(2 ** 31 - 1);
  console.log("Donnée générée");

  // Ecriture synchrone du fichier
  console.log("Ecriture du fichier...");
  fs.writeFileSync(tempFile, largeData);
  console.log("Fichier écrit");

  // Lecture synchrone du fichier
  console.log("Lecture du fichier...");
  const readData = fs.readFileSync(tempFile);
  console.log("Fichier lu");

  // Suppression du fichier temporaire
  console.log("Suppression du fichier...");
  fs.unlinkSync(tempFile);
  console.log("Fichier supprimé");

  return readData.subarray(0, 10);
}

console.log("Démarrage de l'opération synchrone...");

const startTime = performance.now();

console.log("Donnée reçue :", createBigFile().toString("hex"));
console.log("autre process lancé");

let tempNumber = 0;
for (let i = 0; i < 10000; i++) {
  tempNumber += i;
}
console.log("un autre process lancé");
console.log("encore un autre process lancé");

const endTime = performance.now();
console.log(`[SYNC]Temps d'exécution : ${endTime - startTime} ms`);
