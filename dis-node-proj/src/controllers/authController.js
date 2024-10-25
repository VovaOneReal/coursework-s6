const poll = require("../dbPoll");

exports.registration = async (req, res) => {
  try {
    // Проверяем, есть ли логин в системе
    const result = await poll.query(
      "SELECT user_login FROM user WHERE user_login = ?",
      [req.body.login]
    );

    if (result[0].length > 0) {
      res.status(400);
      res.json({
        message:
          "Пользователь с таким логином уже есть. Придумайте другой логин.",
      });
    } else {
      // Иначе регистрируем пользователя в системе
      await poll.query(
        "INSERT INTO user(user_login, user_password, user_registration_date) VALUES(?, ?, CURRENT_TIMESTAMP())",
        [req.body.login, req.body.password]
      );

      // Затем возвращаем записанный в системе логин
      var newLogin = await poll.query(
        "SELECT user_login FROM user WHERE user_login = ?",
        [req.body.login]
      );
      res.json({ ulogin: newLogin[0][0].user_login });
      return;
    }
  } catch (err) {
    return console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    // Проверяем, есть ли логин в системе
    var result = await poll.query(
      "SELECT user_login FROM user WHERE user_login = ? AND user_password = ?",
      [req.body.login, req.body.password]
    );
    if (result[0].length > 0) {
      res.json({ ulogin: result[0][0].user_login });
    } else {
      res.status(403);
      res.json({ message: "Неверный логин или пароль." });
    }
  } catch (err) {
    return console.log(err);
  }
};
