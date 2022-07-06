const booksModel = require("../models/booksModel")
const validator = require('../validator/validator')

const updateBook = async function(req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)){
            return res.status(400).send({status: false,msg: "Incorrect Blog Id format"})
        }   

        let book = await booksModel.findById(bookId)
        if(!book || book.isDeleted == true){
            return res.status(404).send({status : false, msg : "No Book Found"})
        }
        if(req.token.userId !== book.userId){
            return res.status(403).send({ status: false, message: "Not Authorised" })
        }   
        if(!validator.isValidRequestBody(req.body)){
            return res.status(400).send({ status: false, message: "Body is empty, please Provide data" })
        };

        let {title, excerpt, releasedAt, ISBN} = req.body
        if (title && !validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is in incorrect format" })
        };
        let checkBook = await booksModel.find({title})
        if(checkBook){
            return res.status(400).send({ status: false, message: "Title already used" })
        }
        if (excerpt && !validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt is in incorrect format" })
        };
        if (ISBN && !validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is in incorrect format" })
        };
        let checkBook2 = await booksModel.find({ISBN})
        if(checkBook2){
            return res.status(400).send({ status: false, message: "ISBN already used" })
        }
        if (releasedAt && !validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt is in incorrect format" })
        };

        let updatedBook = await booksModel.findOneAndUpdate({_id : bookId}, {...req.body}, {new : true})

        return res.status(200).send({status : true, message: "Success", data: updatedBook })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {updateBook}