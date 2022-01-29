const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");

const app = express();

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.dfb9s.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => console.log(err));
