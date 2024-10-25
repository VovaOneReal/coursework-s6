const poll = require("./dbPoll");

exports.isQueryCorrect = (queries, res) => {
  for (let i = 0; i < queries.length; i++) {
    if (!queries[i]) {
      console.log(queries[i]);
      res.status(400);
      res.json({
        message: "Невозможно произвести операцию: не хватает параметров",
      });
      return false;
    }
  }

  return true;
};

exports.isUserExists = async (ulogin, res) => {
  var isExists = false;
  try {
    await poll
      .query("SELECT user_login FROM user WHERE user_login = ?", [ulogin])
      .then((result) => {
        if (result[0].length <= 0) {
          res.status(404);
          res.json({
            message: "Пользователя с логином " + ulogin + " не существует.",
          });
          isExists = false;
        } else {
          isExists = true;
        }
      });
  } catch (err) {
    return console.log(err);
  } finally {
    return isExists;
  }
};

exports.isRecipeExists = async (rid, res) => {
  var isExists = false;
  try {
    await poll
      .query("SELECT recipe_id FROM recipe WHERE recipe_id = ?", [rid])
      .then((result) => {
        if (result[0].length <= 0) {
          res.status(404);
          res.json({
            message: "Такой рецепт не существует.",
          });
          isExists = false;
        } else {
          isExists = true;
        }
      });
  } catch (err) {
    return console.log(err);
  } finally {
    return isExists;
  }
};

exports.isCollectionExists = async (cid, res) => {
  var isExists = false;
  try {
    await poll
      .query("SELECT collection_id FROM collection WHERE collection_id = ?", [
        cid,
      ])
      .then((result) => {
        if (result[0].length <= 0) {
          res.status(404);
          res.json({
            message: "Такая коллекция не существует.",
          });
          isExists = false;
        } else {
          isExists = true;
        }
      });
  } catch (err) {
    return console.log(err);
  } finally {
    return isExists;
  }
};

exports.getUserRole = async (ulogin, res) => {
  if (!(await this.isUserExists(ulogin, res))) {
    return false;
  }

  try {
    result = await poll.query(
      "SELECT user_login, user_role FROM user WHERE user_login = ?",
      [ulogin]
    );
    return result[0][0].user_role;
  } catch (error) {
    return console.log(error);
  }
};
