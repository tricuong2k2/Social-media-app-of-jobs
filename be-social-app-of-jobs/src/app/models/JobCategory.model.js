const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobCategorySchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  description: { type: String },
});

module.exports = mongoose.model("JobCategory", JobCategorySchema, "tblJobCategory");