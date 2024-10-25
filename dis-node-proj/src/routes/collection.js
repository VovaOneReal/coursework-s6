const express = require("express");
const router = express.Router();

const collectionController = require("../controllers/collectionController");

router.get("/", collectionController.get);
router.post("/", collectionController.post);
router.delete("/", collectionController.delete);
router.delete("/recipe/", collectionController.unlinkRecipe);
router.post("/addrecipe/", collectionController.addToCollection);

module.exports = router;
