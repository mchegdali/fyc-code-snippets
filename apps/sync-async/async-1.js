import fs from "node:fs";
import crypto from "node:crypto";

// Version asynchrone (non-bloquante) pour comparaison
async function createBigFileAsync() {
  const tempFile = "temp-large-file.txt";

  try {
    console.log("Génération de la donnée...");
    const largeData = crypto.randomBytes(2 ** 31 - 1);

    console.log("Donnée générée");
    // Ecriture asynchrone du fichier
    console.log("Ecriture du fichier...");
    await fs.promises.writeFile(tempFile, largeData);
    console.log("Fichier écrit");

    // Lecture asynchrone du fichier
    console.log("Lecture du fichier...");
    const readData = await fs.promises.readFile(tempFile);
    console.log("Fichier lu");

    // Suppression du fichier temporaire
    console.log("Suppression du fichier...");
    await fs.promises.unlink(tempFile);
    console.log("Fichier supprimé");

    return readData.subarray(0, 10);
  } catch (err) {
    console.error("Erreur:", err);
  }
}

console.log("Démarrage de l'opération asynchrone...");

const startTime = performance.now();

// Utilisation de la version non-bloquante :
const createBigFilePromise = createBigFileAsync().then((data) => {
  console.log("Donnée reçue :", data.toString("hex"));
});
console.log("autre process lancé");

let tempNumber = 0;
for (let i = 0; i < 10000; i++) {
  tempNumber += i;
}
console.log("un autre process lancé");
console.log("encore un autre process lancé");

await createBigFilePromise;

const endTime = performance.now();
console.log(`[ASYNC]Temps d'exécution : ${endTime - startTime} ms`);
