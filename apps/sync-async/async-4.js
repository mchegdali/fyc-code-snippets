function createRandomUUIDAsync() {
  return new Promise((resolve) => {
    setTimeout(resolve, 5000, crypto.randomUUID());
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

const jsonPlaceholderResponse1 = fetch(
  "https://jsonplaceholder.typicode.com/todos/1"
);

console.log(
  "juste après fetch / afficher status",
  jsonPlaceholderResponse1.status
);

console.log("juste après fetch / avant json");

const [jsonPlaceholderBody1, jsonPlaceholderResponse2, randomUUID] =
  await Promise.all([
    jsonPlaceholderResponse1.then((response) => response.json()),
    queryPlaceholderApiAsync(),
    createRandomUUIDPromise,
  ]);

console.log(jsonPlaceholderBody1);
console.log(randomUUID);

// grâce à Promise.all, même si l'affichage du fetch1 ne sera fait que lorsque toutes les promises seront en état 'terminée',
// on affiche bien le fetch2 contrairement à async-3.js
