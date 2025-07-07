Correr el proyecto:
version de node >=22
npm install
docker-compose up para la base de datos
npm run start

Testear a mano: 
https://studio.apollographql.com/sandbox/explorer
con urls: 
http://localhost:3000/graphql 
o https://todo-graphql-api-production.up.railway.app/graphql (deployado en railway)

Correr los tests:
npm run test     
npm run test:e2e 

User cargado en la base: username: "admin", password: "1234"