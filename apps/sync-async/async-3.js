function createRandomUUIDAsync() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(crypto.randomUUID());
    }, 5000);
  });
}

async function queryPlaceholderApiAsync() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/2");
  const todo = await response.json();
  console.log("log dans la fonction async", todo);
}

const createRandomUUIDPromise = createRandomUUIDAsync();

console.log("autre process lancé");
console.log("un autre process lancé");
console.log("encore un autre process lancé");

console.log("juste avant fetch");

const jsonPlaceholderResponse1 = await fetch(
  "https://jsonplaceholder.typicode.com/todos/1"
);

console.log(
  "juste après fetch / afficher status",
  jsonPlaceholderResponse1.status
);

console.log("juste après fetch / avant json");

const jsonPlaceholderBody1 = await jsonPlaceholderResponse1.json();
const randomUUID = await createRandomUUIDPromise;
const jsonPlaceholderResponse2 = await queryPlaceholderApiAsync();

console.log(jsonPlaceholderBody1);
console.log(randomUUID);

// les 2 fetch sont bloqués car un timer est déclenché dans createRandomUUIDAsync
// Il bloque l'event loop et les 2 fetch sont donc bloqués
