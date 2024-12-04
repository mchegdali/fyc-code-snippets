console.log("Début du script");

console.log("juste avant fetch");
const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
console.log("juste après fetch / afficher status", response.status);
console.log("juste après fetch / avant json");
const todo = await response.json();
console.log("après json", todo);
