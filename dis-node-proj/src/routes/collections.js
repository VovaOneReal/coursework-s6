const express = require("express");
const router = express.Router();

const collectionsController = require("../controllers/collectionsController");

router.get("/", collectionsController.get);

module.exports = router;
