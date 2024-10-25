const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.get);
router.delete("/", userController.delete);
router.get("/role", userController.getRole);
router.patch("/role", userController.patchRole);

module.exports = router;
