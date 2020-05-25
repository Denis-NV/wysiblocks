const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

console.log("ENV vars");
console.log(process.env.DATABASE_HOST);
console.log(process.env.DATABASE_PORT);
console.log(process.env.DATABASE_NAME);
console.log(process.env.DATABASE_USERNAME);
console.log(process.env.DATABASE_PASSWORD);

//
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes

// Connect to DB
mongoose
  .connect(
    `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
    {
      useNewUrlParser: true,
      user: process.env.DATABASE_USERNAME,
      pass: process.env.DATABASE_PASSWORD,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(
      `Successfully connected to mongo ${process.env.DATABASE_NAME} database at ${process.env.DATABASE_HOST}`
    );
  })
  .catch((err) => {
    console.log("error connecting to the database");
    process.exit();
  });

app.listen(8080);
