import express from "express";
import {
  getAllBooks,
  getBooksByCategory,
  getBooksByName,
  getRentPrice,
} from "../controllers/book-controller.js";
const bookRoute = express.Router();

bookRoute.get('/books', getAllBooks)
bookRoute.get("/search", getBooksByName);
bookRoute.get("/rent", getRentPrice);
bookRoute.get("/filter", getBooksByCategory);

export default bookRoute