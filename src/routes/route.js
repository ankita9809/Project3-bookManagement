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
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReviwsById)


router.all("/**", function (req, res) {         // To check whether correct api is provided or not
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports = router;