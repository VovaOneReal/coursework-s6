const poll = require("../dbPoll");
const utils = require("../utils");

exports.get = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.cid, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие коллекции в системе
  const isCollectionExists = await utils.isCollectionExists(req.query.cid, res);
  if (!isCollectionExists) {
    return;
  }

  try {
    var collectionInfo = {
      id: null,
      name: null,
      creation_date: null,
      recipes: [],
    };

    // Запрашиваем инфу о коллекции
    var collectionItems = await poll.query(
      "SELECT * FROM collection WHERE collection_id = ?",
      [req.query.cid]
    );

    collectionInfo.id = collectionItems[0][0].collection_id;
    collectionInfo.name = collectionItems[0][0].collection_name;
    collectionInfo.creation_date =
      collectionItems[0][0].collection_creation_date;

    // Запрашиваем инфу о рецептах внутри коллекции
    var recipesItems = await poll.query(
      "SELECT * FROM collectionrecipe WHERE collection_id = ?",
      [req.query.cid]
    );
    for (var i = 0; i < recipesItems[0].length; i++) {
      if (recipesItems[0].length > 0) {
        var recipeInfo = await poll.query(
          "SELECT * FROM recipe WHERE recipe_id = ?",
          [recipesItems[0][i].recipe_id]
        );

        collectionInfo.recipes.push(recipeInfo[0][0]);
      }
    }
    res.json(collectionInfo);
  } catch (err) {
    return console.log(err);
  }
};

exports.post = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.ulogin], res)) {
    return;
  }

  // Проверяем наличие пользователя в системе
  const isUserExists = await utils.isUserExists([req.query.ulogin], res);
  if (!isUserExists) {
    return;
  }

  // Добавляем коллекцию в систему
  try {
    collectionInsert = await poll.query(
      "INSERT INTO collection(collection_name, collection_status) VALUES(?, ?)",
      [req.body.name, req.body.status]
    );

    userCollectionInsert = await poll.query(
      "INSERT INTO usercollection(collection_id, user_login) VALUES(?, ?)",
      [collectionInsert[0].insertId, req.query.ulogin]
    );

    res.json({ message: "Коллекция успешно добавлена." });
  } catch (err) {
    return console.log(err);
  }
};

exports.delete = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.cid, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие коллекции в системе
  const isCollectionExists = await utils.isCollectionExists(req.query.cid, res);
  if (!isCollectionExists) {
    return;
  }

  try {
    await poll.query(
      "DELETE FROM usercollection WHERE collection_id = ? AND user_login = ?",
      [req.query.cid, req.query.rlogin]
    );
    res.json({ message: "Коллекция успешно удалёна." });
  } catch (err) {
    return console.log(err);
  }
};

exports.unlinkRecipe = async (req, res) => {
  // Проверяем правильность query
  if (
    !utils.isQueryCorrect([req.query.cid, req.query.rid, req.query.rlogin], res)
  ) {
    return;
  }

  // Проверяем наличие коллекции в системе
  const isCollectionExists = await utils.isCollectionExists(req.query.cid, res);
  if (!isCollectionExists) {
    return;
  }

  try {
    await poll.query(
      "DELETE FROM collectionrecipe WHERE collection_id = ? AND recipe_id = ?",
      [req.query.cid, req.query.rid]
    );
    res.json({ message: "Рецепт успешно убран из коллекции." });
  } catch (err) {
    return console.log(err);
  }
};

exports.addToCollection = async (req, res) => {
  // Проверяем правильность query
  if (
    !utils.isQueryCorrect([req.query.cid, req.query.rid, req.query.rlogin], res)
  ) {
    return;
  }

  // Проверяем наличие коллекции в системе
  const isCollectionExists = await utils.isCollectionExists(req.query.cid, res);
  if (!isCollectionExists) {
    return;
  }

  // Проверяем наличие рецепта в системе
  const isRecipeExists = await utils.isRecipeExists(req.query.rid, res);
  if (!isRecipeExists) {
    return;
  }

  //   Производим добавление
  try {
    // Проверяем, есть ли рецепт в этой коллекции
    var isRecipeAlreadyIn = await poll.query(
      "SELECT * FROM collectionrecipe WHERE recipe_id = ? AND collection_id = ?",
      [req.query.rid, req.query.cid]
    );

    if (isRecipeAlreadyIn[0].length > 0) {
      res.status(400).json({ message: "Рецепт уже добавлен в коллекцию" });
      return;
    } else {
      // Добавляем рецепт в коллекцию
      await poll.query(
        "INSERT INTO collectionrecipe(recipe_id, collection_id) VALUES(?, ?)",
        [req.query.rid, req.query.cid]
      );
      res.json({ message: "Рецепт успешно добавлен в коллекцию." });
    }
  } catch (err) {
    return console.log(err);
  }
};
