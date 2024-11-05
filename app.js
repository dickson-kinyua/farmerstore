const express = require("express");
require("dotenv").config();
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const allRoutes = require("./Routes/routes");
const authRouter = require("./Routes/auth.routes");

const app = express();

//middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.static(__dirname));
app.use(cookieparser());

const db = process.env.MONGO_DB;
const port = process.env.PORT;
mongoose
  .connect(db)
  .then((result) => {
    console.log("Connected to the database");
    app.listen(4002, () => console.log("Listening to port:", port));
  })
  .catch((err) => console.log(err));

app.use("/auth", authRouter);
app.use(allRoutes);
