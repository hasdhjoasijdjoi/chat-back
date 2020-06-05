import { GraphQLServer, PubSub } from "graphql-yoga";
const pubsub = new PubSub();
const NEW_CHAT = "NEW_CHAT";

let chattingLog = [
  {
    id: 0,
    writer: "admin",
    description: "HELLO",
  },
];

const typeDefs = `
    type Chat {
        id: Int!
        writer: String!
        description: String!
    }
    
    type Query {
        chatting: [Chat]!
    }

    type Mutation {
        write(writer: String!, description: String!): String!

    }
    type Subscription {
        newChat: Chat
    }
`;

const resolvers = {
  Query: {
    chatting: () => {
      return chattingLog;
    },
  },
  Mutation: {
    write: (_, { writer, description }) => {
      const id = chattingLog.length;
      const newChat = {
        id,
        writer,
        description,
      };
      chattingLog.push(newChat);
      return "YES";
    },
  },
  Subscription: {
    newChat: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_CHAT),
    },
  },
};

const server = new GraphQLServer({
  // 객체데이터를 매개변수로 받는다.
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: { pubsub },
});

server.start(() => console.log("Graphql Server Running")); //함수데이터를 매개변수로받는다.
