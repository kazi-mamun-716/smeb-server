const mongoose = require("mongoose");

const academiSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    address: String,
    district: String
},{
    timestamps: false
});

const Academi = mongoose.model("Academi", academiSchema);

module.exports = Academi;
