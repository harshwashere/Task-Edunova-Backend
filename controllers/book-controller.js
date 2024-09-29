import Book from "../models/book-model.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();

    if (!books)
      return res.status(404).json({ Message: "No books are available" });

    return res.status(200).json({ books });
  } catch (error) {
    return req.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBooksByName = async (req, res) => {
  try {
    const { term } = req.query;

    const books = await Book.find({ bookName: new RegExp(term, "i") });

    if (!books) return res.status(404).json({ msg: "No books found" });

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRentPrice = async (req, res) => {
  try {
    const { min, max } = req.query;

    const books = await Book.find({
      rentPerDay: { $gte: Number(min), $lte: Number(max) },
    });

    if (!books) return res.status(404).json({ msg: "No books found" });

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBooksByCategory = async (req, res) => {
  try {
    const { category, name, min, max } = req.query;

    const books = await Book.find({
      category: category ? new RegExp(category, "i") : { $exists: true },
      bookName: name ? new RegExp(name, "i") : { $exists: true },
      rentPerDay: {
        $gte: min ? Number(min) : 0,
        $lte: max ? Number(max) : Number.MAX_SAFE_INTEGER,
      },
    });

    if (books.length === 0) {
      return res.status(404).json({ msg: "Nothing found" });
    }

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
