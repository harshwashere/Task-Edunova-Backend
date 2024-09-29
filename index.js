import express from "express";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import connection from "./config/db.js";
import bookRoute from "./router/book-router.js";
import transactionRoute from "./router/transaction-router.js";
import route from "./router/user-router.js";
import cors from "cors";
configDotenv();
const PORT = process.env.PORT;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  method: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credential: true,
};

app.use(cors(corsOptions))

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", route);

app.use("/books", bookRoute);

app.use("/transactions", transactionRoute);

connection().then(() =>
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
);
