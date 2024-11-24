const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: { type: String },
  companySize: { type: Number },
  field: { type: String },
  introduction: { type: String },
  website: { type: String },
  taxCode: { type: String },
  license: { type: String },
  address: {
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
    detail: {
      type: String,
      default: "",
    }
  }
});

module.exports = mongoose.model("Company", CompanySchema, "tblCompany");