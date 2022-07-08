const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const validator = require('../validator/validator')


// -------------------------- CREATE Reviews --------------------

const createReview = async function (req, res) {
    try {
        let requestBody = req.body
        let bookId = req.params.bookId

        let { reviewedBy, reviewedAt, rating, review, isDeleted } = requestBody
        if (!validator.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "bookId must be present" })
        };
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, msg: "Incorrect bookId format" })
        }

        let book = await booksModel.findById(bookId)
        if (!book || book.isDeleted == true) {
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
        await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } })
        return res.status(201).send({ status: true, message: "Review created successfully", data: reviewDoc })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//==============================Updating an existing review.======================================

const updateReview = async function (req, res) {
    try {
        const bookParams = req.params.bookId;
        const reviewParams = req.params.reviewId
        const requestUpdateBody = req.body
        const { review, rating, reviewedBy } = requestUpdateBody;


        //validation 
        if (!validator.isValidRequestBody(requestUpdateBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details to update.' })
        }
        if (!bookParams.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, msg: "Incorrect bookId format" })
        }
        if (!reviewParams.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, msg: "Incorrect reviewId format" })
        }

        if (review || rating || reviewedBy) {
            if (!validator.validString(review)) {
                return res.status(400).send({ status: false, message: "Review is missing ! Please provide the review details to update." })
            }
            if (!validator.validString(reviewedBy)) {
                return res.status(400).send({ status: false, message: "Reviewer's name is missing ! Please provide the name to update." })
            };
            if (!isNaN(reviewedBy)) {
                return res.status(400).send({ status: false, message: "Reviewer's name cannot be a number." })
            }
            //============checking whether the rating is number or character.
            if (typeof (rating) === 'number') {
                if (isNaN(rating)) {
                    return res.status(400).send({ status: false, message: "rating's  must be a number." })
                }
                if (req.body.rating === 0) {
                    return res.status(400).send({ status: false, message: "Rating cannot be 0. Please provide rating between 1 to 5." })
                }
                if (!(rating > 0 && rating < 6)) {
                    return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
                }
            }
            //finding book and review on which we have to update.
            const searchBook = await booksModel.findById({ _id: bookParams }).select({ createdAt: 0, updatedAt: 0, __v: 0 })
            if (!searchBook) {
                return res.status(404).send({ status: false, message: `Book does not exist by this ${bookParams}. ` })
            }
            const searchReview = await reviewModel.findById({ _id: reviewParams })
            if (!searchReview) {
                return res.status(404).send({
                    status: false,
                    message: `Review does not exist by this ${reviewParams}.`
                })
            }
            //verifying the attribute isDeleted:false or not for both books and reviews documents.
            if (searchBook.isDeleted == false) {
                if (searchReview.isDeleted == false) {
                    const updateReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewParams }, { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })
                    let destructureForResponse = searchBook.toObject();
                    destructureForResponse['updatedReview'] = updateReviewDetails;
                    return res.status(200).send({ status: true, message: "Successfully updated the review of the book.", data: destructureForResponse })
                } else {
                    return res.status(400).send({ status: false, message: "Unable to update details.Review has been already deleted" })
                }
            } else {
                return res.status(400).send({ status: false, message: "Unable to update details.Book has been already deleted" })
            }



        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


    // -------------------------- DELETE /books/:bookId/review/:reviewId --------------------

    const deleteReviwsById = async function (req, res) {
        try {
            bookId = req.params.bookId;
            if (!booksId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).send({ status: false, message: "Incorrect Book Id format" })
            }
            reviewId = req.params.reviewId;
            if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).send({ status: false, message: "Incorrect Review Id format" })
            }


        } catch (err) {
            return res.status(500).send({ status: fallse, message: err.message })
        }
    }

    module.exports = { createReview, deleteReviwsById, updateReview }
