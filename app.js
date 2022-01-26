const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type RootQuery {
        events: [String!]!
    }
    
    type RootMutation {
        createEvent(name: String!): String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return ["event 1", "event 2", "event 3"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return `event created: ${eventName}`;
      },
    },
    graphiql: true,
  })
);

app.listen(4000);
