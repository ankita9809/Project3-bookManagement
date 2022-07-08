const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema ({
    bookId: {
        type : ObjectId, 
        require : true, 
        ref : "booksDb"
    },
    reviewedBy: {
        type : String, 
        require : true, 
        default : 'Guest', 
    },
    reviewedAt: {
        type : Date, 
        require : true
    },
    rating: {
        type : Number, 
        require : true
    },
    review: String,
    isDeleted: {
        type : Boolean, 
        default: false
    }
},
{timestamps : true});
 
module.exports = mongoose.model ('reviewDb', reviewSchema)