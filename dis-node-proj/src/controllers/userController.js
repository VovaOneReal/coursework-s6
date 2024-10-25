const poll = require("../dbPoll");
const utils = require("../utils");

exports.get = async (req, res) => {
  // Правильность query
  if (!utils.isQueryCorrect([req.query.ulogin, req.query.rlogin], res)) {
    return;
  }

  // Проверяем, есть ли пользователь в системе
  const result = await utils.isUserExists(req.query.ulogin, res);
  if (!result) {
    return;
  }

  // Проверяем роль запрашивающего пользователя в системе
  const role = await utils.getUserRole(req.query.rlogin, res);

  var userInfo = {
    login: null,
    collections: [],
    diets: [],
    recipes: [],
  };

  // Собираем инфу
  // Логин пользователя
  try {
    await poll
      .query("SELECT user_login FROM user WHERE user_login = ?", [
        req.query.ulogin,
      ])
      .then((result) => {
        userInfo.login = result[0][0].user_login;
      });

    // Коллекции пользователя
    var collectionsResult = null;
    if (role == "admin" || req.query.ulogin == req.query.rlogin) {
      // Получаем все коллекции, если это админ или владелец информации
      collectionsResult = await poll.query(
        "SELECT * FROM usercollection_view WHERE user_login = ?",
        [req.query.ulogin]
      );
    } else {
      // Только публичные, если все остальные пользователи
      collectionsResult = await poll.query(
        "SELECT * FROM usercollection_view WHERE user_login = ? AND collection_status = 'public'",
        [req.query.ulogin]
      );
    }

    for (let i = 0; i < collectionsResult[0].length; i++) {
      userInfo.collections.push(collectionsResult[0][i]);
    }

    // Планы пользователя
    if (role == "admin" || req.query.ulogin == req.query.rlogin) {
      var dietsResult = null;
      dietsResult = await poll.query(
        "SELECT diet_id, diet_name, diet_creation_date, diet_date FROM diet WHERE user_login = ?",
        [req.query.ulogin]
      );
      for (let i = 0; i < dietsResult[0].length; i++) {
        userInfo.diets.push(dietsResult[0][i]);
      }
    }

    // Рецепты пользователя
    var recipesResult = null;
    if (role == "admin" || req.query.ulogin == req.query.rlogin) {
      // Получаем все коллекции, если это админ или владелец информации
      recipesResult = await poll.query(
        "SELECT * FROM recipe WHERE user_login = ?",
        [req.query.ulogin]
      );
    } else if (role == "editor") {
      recipesResult = await poll.query(
        "SELECT * FROM recipe WHERE user_login = ? AND recipe_status IN ('onModeration', 'public')",
        [req.query.ulogin]
      );
    } else {
      // Только публичные, если все остальные пользователи
      recipesResult = await poll.query(
        "SELECT * FROM recipe WHERE user_login = ? AND recipe_status = 'public'",
        [req.query.ulogin]
      );
    }

    for (let i = 0; i < recipesResult[0].length; i++) {
      userInfo.recipes.push(recipesResult[0][i]);
    }

    res.json(userInfo);
  } catch (err) {
    return console.log(err);
  }
};

exports.delete = async (req, res) => {
  // Правильность query
  if (!utils.isQueryCorrect([req.query.ulogin, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие такого пользователя
  if (!(await utils.isUserExists(req.query.ulogin, res))) {
    return;
  }

  // Проверяем, может ли пользователь производить удаление
  var role = await utils.getUserRole(req.query.rlogin);

  if (role == "admin") {
    try {
      // Удаление пользователя
      await poll
        .query("DELETE FROM user WHERE user_login = ?", [req.query.ulogin])
        .then(() => {
          res.json({
            message:
              "Пользователь с логином " + req.query.ulogin + " успешно удалён",
          });
        });
    } catch (err) {
      return console.log(err);
    }
  } else {
    res.status(403).json({ message: "Недостаточно прав для удаления" });
  }
};

exports.getRole = async (req, res) => {
  // Правильность query
  if (!utils.isQueryCorrect([req.query.ulogin], res)) {
    return;
  }

  result = await utils.getUserRole(req.query.ulogin, res);
  if (result) {
    res.json({ role: result });
  }
};

exports.patchRole = async (req, res) => {
  // Правильность query
  if (
    !utils.isQueryCorrect(
      [req.query.ulogin, req.query.rlogin, req.query.role],
      res
    )
  ) {
    return;
  }

  // Проверяем корректность указанной роли
  if (["user", "editor", "admin"].includes(req.query.role)) {
    // Проверяем, что на это есть права
    if ((await utils.getUserRole(req.query.rlogin)) == "admin") {
      try {
        await poll.query("UPDATE user SET user_role = ?", [req.query.rlogin]);
      } catch (error) {
        console.log(error);
      }
      res.status(200);
      return;
    } else {
      res.status(403).json({ message: "Недостаточно прав." });
      return;
    }
  } else {
    res.status(400).json({ message: "Неверно указана роль." });
    return;
  }
};
