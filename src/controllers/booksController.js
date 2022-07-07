const booksModel = require("../models/booksModel")
const validator = require('../validator/validator')

// --------------------------- REGEX -----------------------------
const stringRegex = /^[ a-z ]+$/i
// ------------------------------- CREATE BOOKS ----------------------------------------------------------

const bookCreation = async function (req, res) {
    try {
        let requestBody = req.body;
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = requestBody

        if (!validator.isValidRequestBody(requestBody)) { 
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' })
        }
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title   must be present" })
        };
        
        if (!validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt must be present" })
        };
       
        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, message: "userId must be present" })
        };
        if (!userId.match(/^[0-9a-fA-F]{24}$/)){
            return res.status(400).send({status: false,msg: "Incorrect userId format"})
        } 

        if (userId != req.token.userId ) {
            return res.status(403).send({
                status: false,
                message: "Unauthorized access ! User's credentials do not match."
            })
        }
        if (!validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN must be present" })
        };
      
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, message: "category must be present" })
        };
        if (!category.match(stringRegex)) {
            return res.status(400).send({ status: false, msg: "category cannot be number" })
        };
        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "subcategory must be present" })
        };
        if (!subcategory.match(stringRegex)) {
            return res.status(400).send({ status: false, msg: "subcategory cannot be number" })
        };
        if (!validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt must be present" })
        };
        if(!validator.isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt is in incorrect format (YYYY-MM-DD)" })
        }
         //searching title & ISBN in database to maintain their uniqueness.
          let checkBook = await booksModel.findOne({ title: title })
        if(checkBook){
            return res.status(400).send({ status: false, message: "Title already used" })
        }
         let checkBook2 = await booksModel.findOne({ ISBN: ISBN})
        if(checkBook2){
            return res.status(400).send({ status: false, message: "ISBN already used" })
        }
    
        const newBook = await booksModel.create(requestBody);
        return res.status(201).send({ status: true, message: "Book created successfully", data: newBook })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    } 
}

// ---------------------------- GET /books/:bookId -----------------

const getBooksById = async function(req,res){
    try{
        const bookId = req.params.bookId;


    }catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}


//  ------------------------------------ PUT /books/:bookId --------------------

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
        if(req.token.userId != book.userId){
            return res.status(403).send({ status: false, message: "Not Authorised" })
        }   
        if(!validator.isValidRequestBody(req.body)){
            return res.status(400).send({ status: false, message: "Body is empty, please Provide data" })
        };

        let {title, excerpt, releasedAt, ISBN} = req.body
        if (title){
            if(!validator.isValid(title)) {
                return res.status(400).send({ status: false, message: "Title is in incorrect format" })
            };
            let checkBook = await booksModel.findOne({title})
            if(checkBook){
                return res.status(400).send({ status: false, message: "Title already used" })
            }
        } 
        if (excerpt && !validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt is in incorrect format" })
        };
        if (ISBN){
            if(!validator.isValid(ISBN)) {
                return res.status(400).send({ status: false, message: "ISBN is in incorrect format" })
            };
            let checkBook2 = await booksModel.findOne({ISBN})
            if(checkBook2){
                return res.status(400).send({ status: false, message: "ISBN already used" })
            }
        } 
        if (releasedAt){
            if(!validator.isValid(releasedAt)) {
                return res.status(400).send({ status: false, message: "releasedAt is required" })
            };
            if(!validator.isValidDate(releasedAt)) {
                return res.status(400).send({ status: false, message: "releasedAt is in incorrect format (YYYY-MM-DD)" })
            }
        } 
        

        let updatedBook = await booksModel.findOneAndUpdate({_id : bookId}, {...req.body}, {new : true})

        return res.status(200).send({status : true, message: "Success", data: updatedBook })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


// ------------------------- DELETE /books/:booksId -------------------

const deleteBooksById = async function(req, res){
    try{
        const booksId = req.params.bookId
        if (!booksId.match(/^[0-9a-fA-F]{24}$/)){
            return res.status(400).send({status: false,msg: "Incorrect Book Id format"})
        }

        let book = await booksModel.findById(booksId)
        if(!book || book.isDeleted == true){
            return res.status(404).send({ status: false, message: "No such book exist"})
        };
        if(req.token.userId != book.userId){
            return res.status(403).send({ status: false, message: "Not Authorised" })
        }

        let deletedBook = await booksModel.findOneAndUpdate({_id: booksId}, {isDeleted: true, deletedAt: new Date()})
        return res.status(200).send({status: true, message: "Book deleted successfully"})


    }catch(err){
        return res.status(500).send({ status: false, message: err.message})
    }

}

module.exports = { bookCreation, getBooksById, updateBook, deleteBooksById }

