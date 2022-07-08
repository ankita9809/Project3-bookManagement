const reviewModel = require("../models/reviewModel")

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

module.exports = {deleteReviwsById}