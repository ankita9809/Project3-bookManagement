module.exports = {deleteReviwsById}
const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const validator = require('../validator/validator')


// -------------------------- CREATE Reviews --------------------

const createReview = async function(req, res){
    try {
        let requestBody = req.body
        let bookId = req.params.bookId

        let {reviewedBy, reviewedAt, rating, review, isDeleted} = requestBody
        if (!validator.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "bookId must be present" })
        };
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)){
            return res.status(400).send({status: false,msg: "Incorrect bookId format"})
        } 

        let book = await booksModel.findById(bookId)
        if(!book || book.isDeleted == true){
            return res.status(400).send({ status: false, message: "No book found" })
        }
        if (!validator.isValidRequestBody(requestBody)) { 
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' })
        }
        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "reviewedBy must be present" })
        };
        if (!reviewedBy.match(/^[ a-z ]+$/i)) {
            return res.status(400).send({ status: false, message: "reviewedBy is in wrong format" })
        };
        if (review && !validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "review must be present" })
        };
        if (!validator.isValid(rating)) {
            return res.status(400).send({ status: false, message: "rating must be present" })
        };
        if(typeof rating != "number") {
            return res.status(400).send({ status: false, message: "rating is in wrong format" })
        };
        if (!validator.isValidRating(rating)) {
            return res.status(400).send({ status: false, message: "rating must be between 1 and 5" })
        };
        if(isDeleted && typeof isDeleted != 'boolean') {
            return res.status(400).send({ status: false, message: "isDeleted is in wrong format" })
        };

        requestBody.reviewedAt = new Date()
        requestBody.bookId = bookId
        
        const reviewDoc = await reviewModel.create(requestBody)
        await booksModel.findOneAndUpdate({_id : bookId}, { $inc : {reviews : 1}})
        return res.status(201).send({status : true, message: "Review created successfully", data: reviewDoc })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// -------------------------- DELETE /books/:bookId/review/:reviewId --------------------

const deleteReviwsById = async function(req, res){
    try{
        bookId = req.params.bookId;
        if (!booksId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect Book Id format" })
        }
        reviewId = req.params.reviewId;
        if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect Review Id format" })
        }


    }catch (err){
        return res.status(500).send({status: fallse, message: err.message})
    }
}

module.exports = {createReview, deleteReviwsById}
