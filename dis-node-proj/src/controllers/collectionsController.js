const poll = require("../dbPoll");
const utils = require("../utils");

exports.get = async (req, res) => {
  // Проверяем правильность query
  if (!utils.isQueryCorrect([req.query.ulogin, req.query.rlogin], res)) {
    return;
  }

  // Проверяем наличие пользователей в системе
  const isUserExists = await utils.isUserExists(req.query.ulogin, res);
  if (!isUserExists) {
    return;
  }

  const isReqUserExists = await utils.isUserExists(req.query.rlogin, res);
  if (!isReqUserExists) {
    return;
  }

  // Проверяем права на получение коллекций
  var userRole = null;
  await utils.getUserRole(req.query.rlogin, res).then((result) => {
    userRole = result;
  });

  try {
    var collections = [];

    var collectionItems = null;

    // Производим получение коллекций в зависимости от роли пользователя
    if (userRole == "admin" || req.query.ulogin == req.query.rlogin) {
      // Запрашиваем инфу о всех коллекциях
      await poll
        .query("SELECT * FROM usercollection_view WHERE user_login = ?", [
          req.query.ulogin,
        ])
        .then((result) => {
          collectionItems = result[0];
        });
    } else if (userRole == "editor") {
      // Запрашиваем инфу о всех публичных коллекциях и коллекциях для модерации
      await poll
        .query(
          "SELECT * FROM usercollection_view WHERE user_login = ? AND collection_status IN ('public', 'onModeration')",
          [req.query.ulogin]
        )
        .then((result) => {
          collectionItems = result[0];
        });
    } else {
      // Обычные пользователи увидят только публичные коллекции
      await poll
        .query(
          "SELECT * FROM usercollection_view WHERE user_login = ? AND collection_status IN ('public')",
          [req.query.ulogin]
        )
        .then((result) => {
          collectionItems = result;
        });
    }

    for (var i = 0; i < collectionItems.length; i++) {
      var collectionInfo = {
        id: null,
        name: null,
        creation_date: null,
      };
      collectionInfo.id = collectionItems[i].collection_id;
      collectionInfo.name = collectionItems[i].collection_name;
      collectionInfo.creation_date =
        collectionItems[i].collection_creation_date;

      collections.push(collectionInfo);
    }

    res.json(collections);
  } catch (err) {
    return console.log(err);
  }
};
