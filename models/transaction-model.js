import { Schema, model } from "mongoose";

const transactionModel = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  rentCharged: {
    type: Number,
  },
});

const Transaction = new model("Transactions", transactionModel);

export default Transaction;
