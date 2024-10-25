const express = require("express");
const router = express.Router();

const ingredientController = require("../controllers/ingredientController");

router.get("/", ingredientController.get);
router.post("/", ingredientController.post);
router.patch("/", ingredientController.patch);
router.delete("/", ingredientController.delete);

module.exports = router;
