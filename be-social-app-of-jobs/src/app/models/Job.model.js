const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  deadlineForSubmission: {
    type: Date,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  formOfWork: {
    type: String,
    required: true,
  },
  gender: { 
    type: String,
    enum: {
      values: ["male", "female", "all"],
      message: "Gender <{VALUE}> is not supported",
    },
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  candidateRequirements: {
    type: String,
    require: true,
  },
  rights: {
    type: String,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  hidden: { type: Boolean, default: false },
  hiddenAt: { type: Date },
  hiddenBy: { 
    type: Schema.Types.ObjectId, 
    ref: "Member", 
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: "JobCategory",
    required: true,
  }],
  locations: [{
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    detail: { type: String },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Job", JobSchema, "tblJob");