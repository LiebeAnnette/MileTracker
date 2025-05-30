import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import typeDefs from "./schemas/typeDefs";
import { resolvers } from "./schemas/resolvers";
import { authMiddleware } from "./utils/auth";
import cors from "cors";

dotenv.config();
const app: Application = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  cache: "bounded", 
  persistedQueries: false,
});

async function startServer() {
  await server.start();
  app.use(cors());
  app.use(express.json());

  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 3001;
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/miletracker"
  );

  console.log("MongoDB connected!");
  app.listen(PORT, () =>
    console.log(
      `Server running on http://localhost:${PORT}${server.graphqlPath}`
    )
  );
}

startServer();
