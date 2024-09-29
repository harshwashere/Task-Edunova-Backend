import Transaction from "../models/transaction-model.js";
import Book from "../models/book-model.js";
import User from "../models/user-model.js";

export const issueBook = async (req, res) => {
  try {
    const { bookId, bookName, userId, issueDate } = req.body;

    const book = await Book.findOne({ bookId });

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }

    if (!book || !book.available) {
      return res.status(404).json({ Message: "Book not available" });
    }

    const transaction = new Transaction({
      transactionId: `T-${Date.now()}`,
      bookId,
      bookName,
      userId,
      issueDate,
      returnDate: null,
      rentCharged: null,
    });
    await transaction.save();

    book.available = false;
    await book.save();

    res.status(200).json({ transaction });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { bookId, userId, returnDate } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }

    const transaction = await Transaction.findOne({
      bookId,
      userId,
      returnDate: null,
    });

    if (!transaction) {
      return res.status(404).json({ error: "No active transaction found" });
    }

    const issueDate = transaction.issueDate;
    const days = Math.ceil(
      (new Date(returnDate) - issueDate) / (1000 * 60 * 60 * 24)
    );

    const book = await Book.findOne({ bookId });
    const totalRent = days * book.rentPerDay;

    transaction.returnDate = returnDate;
    transaction.rentCharged = totalRent;
    await transaction.save();

    book.available = true;
    await book.save();

    res.status(200).json({ transaction });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsersListWhoIssuedBook = async (req, res) => {
  try {
    const { bookName } = req.params;

    const book = await Book.findOne({ bookName });

    if (!book) return res.status(404).json({ Message: "Book not found" });

    const transactions = await Transaction.find({
      bookId: book.bookId,
    });

    const issuedPeople = transactions.map((transaction) => ({
      userId: transaction._id,
      name: transaction.name,
      issueDate: transaction.issueDate,
      returnDate: transaction.returnDate,
    }));

    const currentylyIssued = transactions.find(
      (transaction) => transaction.returnDate === null
    );

    return res.status(200).json({
      totalIssued: issuedPeople.length,
      currentlyIssued: currentylyIssued
        ? currentylyIssued
        : "Not issued at the moment",
      issuedPeople,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ Message: "Error fetchging transactions ", error });
  }
};

export const getTotalRentGeneratedByBook = async (req, res) => {
  try {
    const { bookName } = req.params;

    const book = await Book.findOne({ bookName });

    if (!book) return res.status(404).json({ Message: "Book Not Found" });

    const transactions = await Transaction.find({ bookId: book.bookId });

    const totalRent = transactions.reduce((total, transaction) => {
      return total + (transaction.rentCharged || 0);
    }, 0);

    return res.status(200).json({ totalRent });
  } catch (error) {
    return res
      .status(500)
      .json({ Message: "Error calculating total rent ", error });
  }
};

export const getListOfBookIssuedToPeole = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }

    const transactions = await Transaction.find({ userId });

    const issuedBooks = transactions.map((transaction) => ({
      bookId: transaction.bookId,
      bookName: transaction.bookName,
      issueDate: transaction.issueDate,
      returnDate: transaction.returnDate,
    }));

    if (issuedBooks.length === 0) return res.status(404).json({issuedBooks: "No Books Are issued to this user at the moment"})

    return res.status(200).json({ issuedBooks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching issued books", error });
  }
};

export const getListOfBookIssueInDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);

    const end = new Date(endDate);

    const transactions = await Transaction.find({
      issueDate: { $gte: start, $lte: end },
    })
      .populate("bookId")
      .populate("userId");

    const issuedBooks = transactions.map((transaction) => ({
      bookId: transaction.bookId._id,
      bookName: transaction.bookId.bookName,
      issuedTo: transaction.userId.name,
      issueDate: transaction.issueDate,
    }));

    return res.status(200).json(issuedBooks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching transactions", error });
  }
};
