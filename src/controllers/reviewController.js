const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const validator = require('../validator/validator')


// -------------------------- CREATE Reviews --------------------

const createReview = async function(req, res){
    try {
        let requestBody = req.body
        let bookId = req.params.bookId

        let {reviewedBy, rating, review} = requestBody
        if (!validator.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is in wrong format" })
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

        if(!reviewedBy) {
            return res.status(400).send({ status: false, message: "reviewedBy is required" })
        };
        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "reviewedBy is in wrong format" })
        };
        if (!reviewedBy.match(/^[ a-z ]+$/i)) {
            return res.status(400).send({ status: false, message: "reviewedBy is in wrong format" })
        };
        if (review && !validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "review is in wrong format" })
        };
        if (!rating) {
            return res.status(400).send({ status: false, message: "rating is required" })
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
        let bookId = req.params.bookId;
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect Book Id format" })
        }
        let reviewId = req.params.reviewId;
        if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect Review Id format" })
        }

        let book = await booksModel.findById(bookId)
        if(!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        let review = await reviewModel.findById(reviewId)
        if(!review || review.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Review not found" })
        }

        await reviewModel.findOneAndUpdate({_id : reviewId}, {isDeleted : true}, {new : true})
        await booksModel.findOneAndUpdate({_id : bookId}, { $inc : {reviews : -1}})

        return res.status(200).send({status: true, message: "Review deleted successfully"})

    }catch (err){
        return res.status(500).send({status: false, message: err.message})
    }
}

module.exports = {createReview, deleteReviwsById}
