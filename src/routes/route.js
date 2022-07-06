const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const booksController = require("../controllers/booksController");
const reviewController = require("../controllers/reviewController");
const mid = require("../middleware/auth")


router.post("/login",userController.loginUser)







module.exports = router;