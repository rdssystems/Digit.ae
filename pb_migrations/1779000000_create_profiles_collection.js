/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)

  try {
    dao.findCollectionByNameOrId("profiles")
    // Já existe, nada a fazer
    return
  } catch (_) {}

  const collection = new Collection({
    name: "profiles",
    type: "base",
    system: false,
    listRule: "user = @request.auth.id",
    viewRule: "user = @request.auth.id",
    createRule: "user = @request.auth.id",
    updateRule: "user = @request.auth.id",
    deleteRule: "user = @request.auth.id",
  })

  collection.schema.addField(new SchemaField({
    name: "user",
    type: "relation",
    required: true,
    options: {
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1
    }
  }))

  collection.schema.addField(new SchemaField({
    name: "name",
    type: "text",
    required: true,
    options: { min: 1, max: 100 }
  }))

  collection.schema.addField(new SchemaField({
    name: "password",
    type: "text",
    required: false,
    options: { max: 255 }
  }))

  collection.schema.addField(new SchemaField({
    name: "config",
    type: "json",
    required: false,
    options: { maxSize: 2000000 }
  }))

  collection.schema.addField(new SchemaField({
    name: "progress",
    type: "json",
    required: false,
    options: { maxSize: 2000000 }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  try {
    const collection = dao.findCollectionByNameOrId("profiles")
    dao.deleteCollection(collection)
  } catch (_) {}
})
