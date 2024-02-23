const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
//for share uploading file
app.use('/assets', express.static('assets'));

const port = process.env.PORT || 4000;

//external route file
app.use('/api/auth', require("./routes/authRoute"));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/forum', require('./routes/forumRoute'));
app.use('/api/basic', require('./routes/basicRoute'));
app.use('/api/admin', require('./routes/adminRoute'));

app.get("/", (req, res)=>{
    res.send('smeb backend is running successfully')
})

app.listen(port, ()=>{
    console.log(`server is running at port: ${port}`)
    mongoose.connect(process.env.MONGODB_URI)
        .then(res=>{
            console.log("Mongodb Connected Successfull!")
        })
        .catch(err=>{
            console.log(err)
        })
})