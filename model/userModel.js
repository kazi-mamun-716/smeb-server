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
        required: true,
        default: "member",
        // enum: ["member", "life time member", "general secretary", "admin", "admin secretary", "president"]
    },
    whatsapp: String,
    telegram: String,
    status: {
        type: String,
        default: "admin secretary",
        enum: ["admin secretary", "general secretary", "president", "active"]
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