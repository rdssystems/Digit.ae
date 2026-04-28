/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");

  // Libera a criação de usuários (Registro público)
  collection.createRule = ""; 
  // Garante que o campo profiles seja um JSON (ajuste de segurança)
  collection.listRule = "id = @request.auth.id";
  collection.viewRule = "id = @request.auth.id";
  collection.updateRule = "id = @request.auth.id";

  return dao.saveCollection(collection);
}, (db) => {
  return null;
})
