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
    await poll
      .query(
        "SELECT collection_id, collection_name, collection_creation_date FROM collection WHERE user_login = ?",
        [req.query.ulogin]
      )
      .then((result) => {
        for (let i = 0; i < result[0].length; i++) {
          userInfo.collections.push(result[0][i]);
        }
      });

    // Планы пользователя
    await poll
      .query(
        "SELECT diet_id, diet_name, diet_creation_date, diet_date FROM diet WHERE user_login = ?",
        [req.query.ulogin]
      )
      .then((result) => {
        for (let i = 0; i < result[0].length; i++) {
          userInfo.diets.push(result[0][i]);
        }
      });

    console.log(userInfo.diets);

    // Рецепты пользователя
    await poll
      .query(
        "SELECT recipe_id, recipe_name, recipe_description, recipe_category, recipe_creation_date, recipe_moderation_date, recipe_status \
  FROM recipe WHERE user_login = ?",
        [req.query.ulogin]
      )
      .then((result) => {
        for (let i = 0; i < result[0].length; i++) {
          userInfo.recipes.push(result[0][i]);
        }
      });
  } catch (err) {
    return console.log(err);
  }

  res.json(userInfo);
};
