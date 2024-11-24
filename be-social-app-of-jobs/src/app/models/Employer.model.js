const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EmployerSchema = new Schema({
  department: { type: String },
  member: { 
    type: Schema.Types.ObjectId, 
    ref: "Member",
    unique: true,
    required: true,
  },
  company: { 
    type: Schema.Types.ObjectId, 
    ref: "Company",
    unique: true,
    required: true,
  }
});

module.exports = mongoose.model("Employer", EmployerSchema, "tblEmployer");