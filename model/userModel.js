const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    smebId: {
        type: Number
    },
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
    },    
    mobile:{
        type: String,
    },
    photo: {
      type: String,
      default: "",
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
    },
    membership: {
        type: String,
        enum: ["member", "life time member"]
    },
    whatsapp: String,
    telegram: String,
    status: {
        type: String,
        default: "admin secretary",
    },
    emailVerified:{
        type: Boolean,
        default: false
    },
    personalInfo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Personal"
    },
    academicInfo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Academic"
    },
    lastPayment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },
    lastPaymentDate: Date,
    payments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    forums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forum"
    }],
    ageConfirmation: {
      type: String,
      default: "",
    },
    courseConfirmation: {
      type: String,
      default: "",
    },
},{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User