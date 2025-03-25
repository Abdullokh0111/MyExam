require("module-alias/register");
require("dotenv").config();

const mongana = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");

const connectDb = require("../config/db");
const { default: initRoutes } = require("./routes/index.route");

const app = express();

connectDb();

app.use(express.json());
app.use(cookieParser());
app.use(mongana("dev"));
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥");

  console.log(err.name, err.message);
});

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED Excpections 💥");
  console.log(err.name, err.message);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
