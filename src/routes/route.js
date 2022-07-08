const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const booksController = require("../controllers/booksController");
const reviewController = require("../controllers/reviewController");
const mid = require("../middleware/auth")


// ---------------------------- USER APIs ------------------------------------------
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)


// ---------------------------- BOOKS APIs ------------------------------------------
router.post("/books",mid.auth,booksController.bookCreation)
router.get("/books",mid.auth, booksController.getAllBook)
router.get("/books/:bookId",mid.auth, booksController.getBooksById)
router.put("/books/:bookId", mid.auth, booksController.updateBook)
router.delete("/books/:bookId", mid.auth , booksController.deleteBooksById)

// ---------------------------- Review APIs ------------------------------------------
router.post("/books/:bookId/review", reviewController.createReview)
router.put("/books/:bookId", mid.auth ,bookControl.updateBookDetails)



module.exports = router;