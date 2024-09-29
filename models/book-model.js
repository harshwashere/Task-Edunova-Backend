import { Schema, model } from "mongoose";

const bookModel = new Schema({
  bookId: {
    type: String,
    required: true,
    unique: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rentPerDay: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const Book = new model('Books', bookModel)

export default Book