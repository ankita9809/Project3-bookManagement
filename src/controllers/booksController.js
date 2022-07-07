const { isValidObjectId } = require("mongoose")
const booksModel = require("../models/booksModel")
const validator = require('../validator/validator')

const getAllBook = async function (req, res) {

try {

        const queryParams = req.query
    
        const books = await booksModel.find({...queryParams,isDeleted: false}).sort({ title: 1 }).select('_id title excerpt userId category releasedAt reviews')
    

        if (books && books.length == 0) {
            return res.status(404).send({ status: false, message: "Books not found" })
        }
        return res.status(200).send({ status: true, message: "Books list", data: books })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.getAllBook = getAllBook