import express from "express";
import { getListOfBookIssuedToPeole, getListOfBookIssueInDateRange, getTotalRentGeneratedByBook, getUsersListWhoIssuedBook, issueBook, returnBook } from "../controllers/transaction-controller.js";

const transactionRoute = express.Router();

transactionRoute.post('/issue', issueBook)
transactionRoute.post('/return', returnBook)
transactionRoute.get('/book/:bookName', getUsersListWhoIssuedBook)
transactionRoute.get('/rent/:bookName', getTotalRentGeneratedByBook)
transactionRoute.get('/users/:userId', getListOfBookIssuedToPeole)
transactionRoute.get('/date-range', getListOfBookIssueInDateRange)

export default transactionRoute