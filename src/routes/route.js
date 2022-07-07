const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const booksController = require("../controllers/booksController");
const reviewController = require("../controllers/reviewController");
const mid = require("../middleware/auth")


// ---------------------------- CREATE USER ------------------------------------------
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

//=================================Books========================================
router.post("/books",mid.auth,booksController.bookCreation)
router.put("/books/:bookId", mid.auth, booksController.updateBook)

// ------------------------- DELETE BOOKS --------------------------------------------

router.delete("/books/:bookId", mid.auth , booksController.deleteBooksById)

//=================================Books========================================
router.post("/books/:bookId/review", reviewController.createReview)

module.exports = router;