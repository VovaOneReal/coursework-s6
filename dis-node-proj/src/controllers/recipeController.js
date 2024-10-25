const poll = require("../dbPoll");
const utils = require("../utils");

exports.post = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.ulogin], res)) {
    return;
  }

  // Проверяем наличие пользователя в системе
  const isUserExists = await utils.isUserExists(req.query.ulogin, res);
  if (!isUserExists) {
    return;
  }

  // Добавляем рецепт в систему
  try {
    // Сам рецепт
    recipeInsert = await poll.query(
      "INSERT INTO recipe(user_login, recipe_name, recipe_description, recipe_category) VALUES(?, ?, ?, ?)",
      [req.query.ulogin, req.body.name, req.body.description, req.body.category]
    );

    // Связь рецепта с ингредиентами
    for (let i = 0; i < req.body.ingredients.length; i++) {
      await poll.query(
        "INSERT INTO recipeingredient(recipe_id, ingredient_name, recipe_ingredient_amount, recipe_ingredient_measurement) VALUES(?, ?, ?, ?)",
        [
          recipeInsert[0].insertId,
          req.body.ingredients[i].name,
          req.body.ingredients[i].amount,
          req.body.ingredients[i].measurement,
        ]
      );
    }
    res.json({ message: "Рецепт успешно добавлен." });
  } catch (err) {
    return console.log(err);
  }
};

exports.get = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.rid, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие рецепта в системе
  const isRecipeExists = await utils.isRecipeExists(req.query.rid, res);
  if (!isRecipeExists) {
    return;
  }

  // Получаем и возвращаем информацию о рецепте
  var recipeInfo = {
    id: null,
    user_login: null,
    editor_login: null,
    name: null,
    description: null,
    category: null,
    creation_date: null,
    moderation_date: null,
    status: null,
    ingredients: [],
  };

  try {
    var recipeResult = await poll.query(
      "SELECT * FROM recipe WHERE recipe_id = ?",
      [req.query.rid]
    );

    recipeResult = recipeResult[0];

    if (recipeResult[0]) {
      recipeInfo.id = recipeResult[0].recipe_id;
      recipeInfo.user_login = recipeResult[0].user_login;
      if (recipeResult[0].editor_login) {
        recipeInfo.editor_login = recipeResult[0].editor_login;
      }
      recipeInfo.name = recipeResult[0].recipe_name;
      recipeInfo.description = recipeResult[0].recipe_description;
      recipeInfo.category = recipeResult[0].recipe_category;
      recipeInfo.creation_date = recipeResult[0].recipe_creation_date;
      if (recipeResult[0].recipe_moderation_date) {
        recipeInfo.editor_login = recipeResult[0].recipe_moderation_date;
      }
      recipeInfo.status = recipeResult[0].recipe_status;
    }

    var ingredientResult = await poll.query(
      "SELECT * FROM recipeingredient WHERE recipe_id = ?",
      [req.query.rid]
    );

    if (ingredientResult[0][0]) {
      for (let i = 0; i < ingredientResult[0].length; i++) {
        var ingredientInfo = {
          name: null,
          amount: null,
          measurement: null,
          fats: null,
          proteins: null,
          carbo: null,
          calories: null,
        };

        ingredientInfo.name = ingredientResult[0][i].ingredient_name;
        ingredientInfo.amount = ingredientResult[0][i].recipe_ingredient_amount;
        ingredientInfo.measurement =
          ingredientResult[0][i].recipe_ingredient_measurement;

        await poll
          .query("SELECT * FROM ingredient WHERE ingredient_name = ?", [
            ingredientResult[0][i].ingredient_name,
          ])
          .then((result) => {
            if (result[0][0]) {
              ingredientInfo.fats = result[0][0].ingredient_fats;
              ingredientInfo.proteins = result[0][0].ingredient_proteins;
              ingredientInfo.carbo = result[0][0].ingredient_carbo;
              ingredientInfo.calories = result[0][0].ingredient_calories;
            }
          });
        recipeInfo.ingredients.push(ingredientInfo);
      }
    }
    res.json(recipeInfo);
  } catch (err) {
    return console.log(err);
  }
};

exports.patch = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.rid, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие рецепта в системе
  const isRecipeExists = await utils.isRecipeExists(req.query.rid, res);
  if (!isRecipeExists) {
    return;
  }

  //   Проряем существование пользователя
  const isUserExists = await utils.isUserExists(req.query.rlogin, res);
  if (!isUserExists) {
    return;
  }

  // Изменяем содержимое рецепта
  try {
    // Сам рецепт
    recipeUpdate = await poll.query(
      "UPDATE recipe SET recipe_name = ?, recipe_description = ?, recipe_category = ? WHERE recipe_id = ?",
      [req.body.name, req.body.description, req.body.category, req.query.rid]
    );

    // Сначала удаляем все связи с ингредиентами
    await poll.query("DELETE FROM recipeingredient WHERE recipe_id = ?", [
      req.query.rid,
    ]);

    // Связь рецепта с ингредиентами
    for (let i = 0; i < req.body.ingredients.length; i++) {
      await poll.query(
        "INSERT INTO recipeingredient(recipe_id, ingredient_name, recipe_ingredient_amount, recipe_ingredient_measurement) VALUES(?, ?, ?, ?)",
        [
          req.query.rid,
          req.body.ingredients[i].name,
          req.body.ingredients[i].amount,
          req.body.ingredients[i].measurement,
        ]
      );
    }
    res.json({ message: "Рецепт успешно обновлён." });
  } catch (err) {
    return console.log(err);
  }
};

exports.delete = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.rid, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие рецепта в системе
  const isRecipeExists = await utils.isRecipeExists(req.query.rid, res);
  if (!isRecipeExists) {
    return;
  }

  try {
    // Проверяем права пользователя
    const userRole = await utils.getUserRole(req.query.rlogin);
    var recipeAuthorLogin = null;
    await poll
      .query("SELECT user_login FROM recipe WHERE recipe_id = ?", [
        req.query.rid,
      ])
      .then((result) => {
        recipeAuthorLogin = result[0][0].user_login;
      });

    if (userRole == "admin" || recipeAuthorLogin == req.query.rlogin) {
      await poll.query("DELETE FROM recipe WHERE recipe_id = ?", [
        req.query.rid,
      ]);
      res.json({ message: "Рецепт успешно удалён." });
    }
  } catch (error) {
    return console.log(err);
  }
};

exports.moderation = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.rid, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие рецепта в системе
  const isRecipeExists = await utils.isRecipeExists(req.query.rid, res);
  if (!isRecipeExists) {
    return;
  }

  // Проверяем наличие редактора в системе
  var requestRole = null;
  await utils.getUserRole(req.query.rlogin, res).then((result) => {
    requestRole = result;
  });

  // Получаем логин владельца рецепта
  var userLogin = null;
  await poll
    .query("SELECT user_login FROM recipe WHERE recipe_id = ?", [req.query.rid])
    .then((result) => {
      userLogin = result[0][0].user_login;
    });

  // Изменяем содержимое рецепта
  try {
    if (
      requestRole == "admin" ||
      requestRole == "editor" ||
      userLogin == req.query.rlogin
    ) {
      await poll.query(
        "UPDATE recipe SET recipe_status = 'onModeration' WHERE recipe_id = ?",
        [req.query.rid]
      );
      res.json({ message: "Рецепт отправлен на модерацию" });
    } else {
      res
        .status(403)
        .json({ message: "Недостаточно прав для выполнения операции" });
    }
  } catch (error) {
    return console.log(error);
  }
};

exports.moderationOk = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.rid, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие рецепта в системе
  const isRecipeExists = await utils.isRecipeExists(req.query.rid, res);
  if (!isRecipeExists) {
    return;
  }

  // Проверяем наличие редактора в системе
  var requestRole = null;
  await utils.getUserRole(req.query.rlogin, res).then((result) => {
    requestRole = result;
  });

  // Изменяем содержимое рецепта
  try {
    if (requestRole == "admin" || requestRole == "editor") {
      await poll.query(
        "UPDATE recipe SET recipe_status = 'public' WHERE recipe_id = ?",
        [req.query.rid]
      );
      res.json({ message: "Модерация рецепта была одобрена" });
    } else {
      res
        .status(403)
        .json({ message: "Недостаточно прав для выполнения операции" });
    }
  } catch (error) {
    return console.log(error);
  }
};

exports.moderationDecline = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.rid, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие рецепта в системе
  const isRecipeExists = await utils.isRecipeExists(req.query.rid, res);
  if (!isRecipeExists) {
    return;
  }

  // Получаем логин владельца рецепта
  var userLogin = null;
  await poll
    .query("SELECT user_login FROM recipe WHERE recipe_id = ?", [req.query.rid])
    .then((result) => {
      userLogin = result[0][0].user_login;
    });

  // Проверяем наличие редактора в системе
  var requestRole = null;
  await utils.getUserRole(req.query.rlogin, res).then((result) => {
    requestRole = result;
  });

  // Изменяем содержимое рецепта
  try {
    if (
      requestRole == "admin" ||
      requestRole == "editor" ||
      userLogin == req.query.rlogin
    ) {
      await poll.query(
        "UPDATE recipe SET recipe_status = 'private' WHERE recipe_id = ?",
        [req.query.rid]
      );
      res.json({ message: "Модерация рецепта была отклонена" });
    } else {
      res
        .status(403)
        .json({ message: "Недостаточно прав для выполнения операции" });
    }
  } catch (error) {
    return console.log(error);
  }
};
