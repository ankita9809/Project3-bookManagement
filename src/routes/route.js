const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const booksController = require("../controllers/booksController");
const reviewController = require("../controllers/reviewController");
const mid = require("../middleware/auth")


// ---------------------------- CREATE USER ------------------------------------------
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

router.put("/books/:bookId", mid.auth, booksController.updateBook)

const check = function(req,res){
    console.log("end")
    res.send("login ")
}
router.get("/test", mid.auth, check)



module.exports = router;