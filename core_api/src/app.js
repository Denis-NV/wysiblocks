const fs = require("fs");
const path = require("path");
const express = require("express");
const expressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

//
const app = express();
var corsOptions = {
  origin: "*",
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));

//
const startGraphQLServer = (def_objects) => {
  const server_port = 5000;
  // const gen = new GraphQLSchemaGenerator(def_objects, "payload_ref");

  // const schema = gen.getSchema();

  // app.use(
  //   "/graphql",
  //   expressGraphQL({
  //     schema,
  //     graphiql: true,
  //     pretty: true,
  //   })
  // );

  app.listen(server_port, () => {
    console.log(
      `Running a GraphQL API server at localhost:${server_port}/graphql`
    );
  });
};

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

    startGraphQLServer();
  })
  .catch((err) => {
    console.log("error connecting to the database");
    process.exit();
  });
