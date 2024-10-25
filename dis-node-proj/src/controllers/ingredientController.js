const poll = require("../dbPoll");
const utils = require("../utils");

exports.get = async (req, res) => {
  try {
    result = await poll.query("SELECT * FROM ingredient");
    res.json(result[0]);
  } catch (err) {
    return console.log(err);
  }
};

exports.post = async (req, res) => {
  if (!utils.isQueryCorrect([req.query.rlogin], res)) {
    return;
  }

  // Проверяем, есть ли такой ингредиент или нет
  var result = await poll.query(
    "SELECT ingredient_name FROM ingredient WHERE ingredient_name = ?",
    [req.body.name]
  );

  if (result[0].length > 0) {
    res.status(400).json({ message: "Такой ингредиент уже есть" });
    return;
  }

  try {
    await poll
      .query(
        "INSERT INTO ingredient(ingredient_name, creator_login, ingredient_fats, ingredient_proteins, ingredient_carbo, ingredient_calories) VALUES(?, ?, ?, ?, ?, ?)",
        [
          req.body.name,
          req.query.rlogin,
          req.body.fats,
          req.body.proteins,
          req.body.carbo,
          req.body.calories,
        ]
      )
      .then(() => {
        res.json({ message: "Ингредиент успешно добавлен" });
      });
  } catch (err) {
    return console.log(err);
  }
};

exports.patch = async (req, res) => {
  if (!utils.isQueryCorrect([req.query.iname, req.query.rlogin], res)) {
    return;
  }

  // Проверяем, есть ли такой ингредиент или нет
  var result = await poll.query(
    "SELECT ingredient_name FROM ingredient WHERE ingredient_name = ?",
    [req.body.name]
  );

  if (result[0].length > 0) {
    res.status(400).json({ message: "Такой ингредиент уже есть" });
    return;
  }

  try {
    await poll
      .query(
        "UPDATE ingredient SET ingredient_name = ?, creator_login = ?, ingredient_fats = ?, ingredient_proteins = ?, ingredient_carbo = ?, ingredient_calories = ? WHERE ingredient_name = ?",
        [
          req.body.name,
          req.query.rlogin,
          req.body.fats,
          req.body.proteins,
          req.body.carbo,
          req.body.calories,
          req.body.name,
        ]
      )
      .then(() => {
        res.json({ message: "Ингредиент успешно обновлён" });
      });
  } catch (err) {
    return console.log(err);
  }
};

exports.delete = async (req, res) => {
  if (!utils.isQueryCorrect([req.query.iname, req.query.rlogin], res)) {
    return;
  }

  try {
    await poll
      .query("DELETE FROM ingredient WHERE ingredient_name = ?", [
        req.query.iname,
      ])
      .then(() => {
        res.json({ message: "Ингредиент успешно удалён" });
      });
  } catch (err) {
    res
      .status(400)
      .json({
        message:
          "Удаление не удалось произвести. Вероятно, этот ингредиент уже используется",
      });
    return console.log(err);
  }
};
