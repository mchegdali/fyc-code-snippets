console.log("Début du script");

console.log("juste avant fetch");
const responsePromise = fetch("https://jsonplaceholder.typicode.com/todos/1");
console.log("juste après fetch");
console.log("On peut faire autre chose ici");
console.log(
  "L'important est d'optimiser le taux d'utilisation du thread principale en réalisant des tâches ne nécessitant pas d'attendre la réponse"
);

const response = await responsePromise;
console.log("juste après fetch / avant json");
const todo = await response.json();
console.log("après json", todo);
