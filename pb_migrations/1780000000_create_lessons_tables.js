/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  // 1. Adicionar campo isAdmin na coleção de usuários
  try {
    const usersCol = dao.findCollectionByNameOrId("_pb_users_auth_");
    try {
      usersCol.schema.findFieldByName("isAdmin");
    } catch (_) {
      usersCol.schema.addField(new SchemaField({
        name: "isAdmin",
        type: "bool",
        required: false,
      }));
      dao.saveCollection(usersCol);
    }
  } catch (err) {
    console.error("Erro ao atualizar users:", err);
  }

  // 2. Criar coleção `phases`
  try {
    dao.findCollectionByNameOrId("phases");
  } catch (_) {
    const phasesCol = new Collection({
      name: "phases",
      type: "base",
      system: false,
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
    });

    phasesCol.schema.addField(new SchemaField({
      name: "titulo",
      type: "text",
      required: true,
      options: { min: 1, max: 255 }
    }));

    phasesCol.schema.addField(new SchemaField({
      name: "descricao",
      type: "text",
      required: false,
      options: { max: 1000 }
    }));

    phasesCol.schema.addField(new SchemaField({
      name: "ordem",
      type: "number",
      required: false,
    }));

    dao.saveCollection(phasesCol);
  }

  // 3. Criar coleção `lessons`
  try {
    dao.findCollectionByNameOrId("lessons");
  } catch (_) {
    const phasesCollection = dao.findCollectionByNameOrId("phases");

    const lessonsCol = new Collection({
      name: "lessons",
      type: "base",
      system: false,
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
    });

    lessonsCol.schema.addField(new SchemaField({
      name: "phase",
      type: "relation",
      required: true,
      options: {
        collectionId: phasesCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      }
    }));

    lessonsCol.schema.addField(new SchemaField({
      name: "key",
      type: "text",
      required: false,
      options: { max: 100 }
    }));

    lessonsCol.schema.addField(new SchemaField({
      name: "titulo",
      type: "text",
      required: true,
      options: { min: 1, max: 255 }
    }));

    lessonsCol.schema.addField(new SchemaField({
      name: "subtitulo",
      type: "text",
      required: false,
      options: { max: 500 }
    }));

    lessonsCol.schema.addField(new SchemaField({
      name: "linhas",
      type: "json",
      required: true,
      options: { maxSize: 2000000 }
    }));

    lessonsCol.schema.addField(new SchemaField({
      name: "teclasFoco",
      type: "json",
      required: false,
      options: { maxSize: 500000 }
    }));

    lessonsCol.schema.addField(new SchemaField({
      name: "isScrolling",
      type: "bool",
      required: false,
    }));

    lessonsCol.schema.addField(new SchemaField({
      name: "ordem",
      type: "number",
      required: false,
    }));

    dao.saveCollection(lessonsCol);
  }
}, (db) => {
  const dao = new Dao(db);
  try {
    const lessonsCol = dao.findCollectionByNameOrId("lessons");
    dao.deleteCollection(lessonsCol);
  } catch (_) {}
  try {
    const phasesCol = dao.findCollectionByNameOrId("phases");
    dao.deleteCollection(phasesCol);
  } catch (_) {}
});
