const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const booksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      require: true,
      trim: true,
    },
    userId: {
      type: ObjectId,
      require: true,
      ref: "userdb",
    },
    ISBN: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      require: true,
      trim: true,
    },
    subcategory: {
      type: [String],
      require: true,
    },
    reviews: {
      type: Number,
      default: 0,
    },

    deletedAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    releasedAt: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("booksDb", booksSchema);
