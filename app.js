const express = require("express");
require("dotenv").config();
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const allRoutes = require("./Routes/routes");

const app = express();

//middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.static(__dirname));
app.use(cookieparser());

const db = process.env.MONGO_DB;
mongoose
  .connect("mongodb://localhost:27017/famasto")
  .then((result) => {
    console.log("Connected to the database");
    app.listen(4002, () => console.log("Listening to port"));
  })
  .catch((err) => console.log(err));

app.use(allRoutes);
