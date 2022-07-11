const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const validator = require('../validator/validator')


// ------------------------------------------------ CREATE Reviews -----------------------------------------------------------------------

const createReview = async function (req, res) {
    try {
        let requestBody = req.body
        let bookId = req.params.bookId

        let { reviewedBy, rating, review, isDeleted } = requestBody
        if (!validator.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is in wrong format" })
        };
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, msg: "Incorrect bookId format" })
        }

        let book = await booksModel.findById(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "No book found" })
        }
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' })
        }

        if (!reviewedBy) {
            reviewedBy = "Guest"
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
        if (typeof rating != "number") {
            return res.status(400).send({ status: false, message: "rating is in wrong format" })
        };
        if (!validator.isValidRating(rating)) {
            return res.status(400).send({ status: false, message: "rating must be between 1 and 5" })
        };
        if (isDeleted && typeof isDeleted != 'boolean') {
            return res.status(400).send({ status: false, message: "isDeleted is in wrong format" })
        };

        requestBody.reviewedAt = new Date()
        requestBody.bookId = bookId

        const reviewDoc = await reviewModel.create(requestBody)
        let updatedBook = await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new : true })

        updatedBook = updatedBook.toObject();
        updatedBook['reviewsData'] = [reviewDoc];

        return res.status(201).send({ status: true, message: "Review created successfully", data: updatedBook })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// ----------------------------------------- UPDATE /books/:bookId/review/:reviewId ------------------------------------------------------

const updateReview = async function (req, res) {
    try {
        const bookParams = req.params.bookId;
        const reviewParams = req.params.reviewId
        const requestUpdateBody = req.body
        const { review, rating, reviewedBy } = requestUpdateBody;

        //validation 
        if (!bookParams.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, msg: "Incorrect bookId format" })
        }
        if (!reviewParams.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, msg: "Incorrect reviewId format" })
        }
        if (!validator.isValidRequestBody(requestUpdateBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details to update.' })
        }

        // ---------------------------- checking review validation.
        if (review) {
            if (!validator.isValid(review)) {
                return res.status(400).send({ status: false, message: "Review is missing ! Please provide the review details to update." })
            }

        }
        // ---------------------------- checking reviewedBy validation.
        if (reviewedBy) {

            if (!validator.isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "Reviewer's name is missing ! Please provide the name to update." })
            };
            if (!reviewedBy.match(/^[ a-z ]+$/i)) {
                return res.status(400).send({ status: false, message: "reviewedBy is in wrong format" })
            };
        };

        // --------------------------- checking whether the rating is number or character.
        if (rating) {

            if (typeof rating != "number") {
                return res.status(400).send({ status: false, message: "rating is in wrong format" })
            };
            if (!validator.isValidRating(rating)) {
                return res.status(400).send({ status: false, message: "rating must be between 1 and 5" })
            };
        };

        // --------------------------- finding book and review on which we have to update.
        const searchBook = await booksModel.findOne({ _id: bookParams, isDeleted: false }).select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (!searchBook) {
            return res.status(404).send({ status: false, message: `Book does not exist by this ${bookParams}. ` })
        }
        const searchReview = await reviewModel.findOne({ _id: reviewParams, isDeleted: false })
        if (!searchReview) {
            return res.status(404).send({ 
                status: false,
                message: `Review does not exist by this ${reviewParams}.`
            })
        }
        if (searchReview.bookId != bookParams) {
            return res.status(404).send({ status: false, message: "Review not found for this book" })
        }

        const updateReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewParams }, { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })

        let destructureForResponse = searchBook.toObject();
        destructureForResponse['reviewsData'] = [updateReviewDetails];
        return res.status(200).send({ status: true, message: "Successfully updated the review of the book.", data: destructureForResponse })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


// ---------------------------------------- DELETE /books/:bookId/review/:reviewId -------------------------------------------------------

const deleteReviwsById = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect Book Id format" })
        }
        let reviewId = req.params.reviewId;
        if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect Review Id format" })
        }

        // --------------------------- finding book and review to be deleted

        let book = await booksModel.findById(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        let review = await reviewModel.findById(reviewId)
        if (!review || review.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Review not found" })
        }
        if (review.bookId != bookId) {
            return res.status(404).send({ status: false, message: "Review not found for this book" })
        }

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })
        await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        return res.status(200).send({ status: true, message: "Review deleted successfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createReview, updateReview, deleteReviwsById }
