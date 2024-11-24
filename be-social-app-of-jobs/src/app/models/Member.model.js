const mongoose = require("mongoose");
// const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  password: { 
    type: String, 
    default: null,
    min: [6, 'Pasword must be at least 6, got {VALUE}'],
    max: [25, 'Pasword must be at most 25, got {VALUE}'],
  },
  role: { 
    type: String, 
    required: true, 
    enum: {
      values: ["candidate", "employer", "admin"],
      message: "Role <{VALUE}> is not supported",
    } 
  },
  fullName: { type: String, default: null },
  tel: { 
    type: String, 
    min: [7, 'Minimum phone number 7 numbers, got {VALUE}'],
    max: [15, 'Maximum phone number 15 numbers, got {VALUE}'], 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    index: true, 
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  dob: { type: Date, default: null },
  gender: { 
    type: String,
    enum: {
      values: ["male", "female"],
      message: "Gender <{VALUE} is not supported>",
    },
    get: (value) => value.toLowerCase(),
    set: (value) => value.toLowerCase(),
  },
  address: { type: String, default: null },
  avatar: { type: String, default: null },
  verifiedAt: { 
    type: Date, 
    default: null,  
  },
  hidden: { type: Boolean, default: false },
  hiddenAt: { type: Date },
  hiddenBy: { 
    type: Schema.Types.ObjectId, 
    ref: "Member", 
  },
  online: { type: Boolean },
  onlineAt: { type: Date },
}, {
  timestamps: true,
});

// MemberSchema.plugin(mongooseDelete, {
//   deletedAt : true,
//   deletedBy: true,
//   overrideMethods: true,
// });

// MemberSchema.pre("remove", async function(next) {
//   try {
//     await mongoose.model("User").deleteOne({ member: this._id });
//     const employer = await mongoose.model("Employer").findOneAndDelete({ member: this._id });
//     if (employer) {
//       await mongoose.model("Company").deleteOne({ _id: employer.company });
//     }
//     await mongoose.model("Admin").deleteOne({ member: this._id });

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = mongoose.model("Member", MemberSchema, "tblMember");