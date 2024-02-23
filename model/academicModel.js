const mongoose = require("mongoose");


const academicSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },  
    course: String,   
    institute: String,    
    intake: String,
    passed: String
},{
    timestamps: false
});

const Academic = mongoose.model("Academic", academicSchema);

module.exports = Academic