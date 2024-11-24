const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  googleId: { type: String },
  facebookId: { type: String },
  linkedinId: { type: String },
  education: { type: String },
  resumes: [{
    name: { type: String, required: true },
    resume: { type: String, required: true },
    viewed: { type: Number, default: 0 },
    dowloaded: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now() }
  }],
  member: { 
    type: Schema.Types.ObjectId, 
    ref: "Member",
    unique: true,
    require: true,
  },
  saveJobs: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Job",
    unique: true,
  }]
});

module.exports = mongoose.model("Candidate", CandidateSchema, "tblCandidate");