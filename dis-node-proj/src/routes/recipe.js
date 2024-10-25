const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipeController");

router.post("/", recipeController.post);
router.get("/", recipeController.get);
router.patch("/", recipeController.patch);
router.delete("/", recipeController.delete);
router.patch("/moderation", recipeController.moderation);
router.patch("/moderation/ok", recipeController.moderationOk);
router.patch("/moderation/decline", recipeController.moderationDecline);

module.exports = router;
