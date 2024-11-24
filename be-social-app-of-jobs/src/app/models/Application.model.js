const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: { type: String, required: true },
  description: { type: String },
  appliedAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Application', ApplicationSchema, "tblApplication");