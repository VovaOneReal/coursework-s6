const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const registrationRouter = require("./src/routes/registration");
const loginRouter = require("./src/routes/login");
const userRouter = require("./src/routes/user");
const usersRouter = require("./src/routes/users");
const recipeRouter = require("./src/routes/recipe");
const collectionRouter = require("./src/routes/collection");
const collectionsRouter = require("./src/routes/collections");
const dietRouter = require("./src/routes/diet");
const ingredientRouter = require("./src/routes/ingredient");

app.use(cors());

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Тест успешен!" });
});

app.use("/registration", registrationRouter);
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/users", usersRouter);
app.use("/recipe", recipeRouter);
app.use("/collection", collectionRouter);
app.use("/collections", collectionsRouter);
app.use("/recipe", dietRouter);
app.use("/ingredient", ingredientRouter);

app.listen(port, () => {
  console.log(`Listening ${port}`);
});
