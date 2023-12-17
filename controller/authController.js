const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    const { password, email, ...rest } = req.body;
    const exists = await User.findOne({ email });
    if (!exists) {
      const hashed = await bcrypt.hash(password, 11);
      const user = await User.create({ email, password: hashed, ...rest });
      const jwtToken = jwt.sign(
        { id: user._id, name: user.name, email },
        process.env.SECRET
      );
      res.status(201).json({
        message: "Registration Successfull",
        token: jwtToken,
      });
    }
    res.status(401).json({
      message: "Member Already Registered",
    });
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(401).json({
        message: "Password is incorrect!",
      });
    }
    const jwtToken = jwt.sign(
      { id: user._id, name: user.name, email },
      process.env.SECRET
    );
    res.status(200).json({
      message: "Login Successfull",
      token: jwtToken,
    });
  },
  addUser: async (req, res) => {
    try {
      const { password, email, smebId, ...rest } = req.body;
      const exists = await User.findOne({ email });
      if (!exists) {
        const hashed = await bcrypt.hash(password, 11);
        const idExists = await User.findOne({ smebId });
        if (idExists) {
          return res.status(400).json({
            message: "This SMEB ID alredy given!",
          });
        }
        await User.create({
          email,
          password: hashed,
          smebId,
          status: "active",
          ...rest,
        });
        return res.status(201).json({
          message: "Member Added Successfull",
        });
      }
      return res.status(401).json({
        message: "Member Already Registered",
      });
    } catch (err) {
      console.log("error", err)
      return res.status(500).json({
        message: "Server Side Error!",
      });
    }
  },
  approveUser: async (req, res) => {
    const {id} = req.query;
    let newStatus;
    if(req.body.status === "admin secretary"){
      newStatus = "general secretary"
    }else if(req.body.status === "general secretary"){
      newStatus = "president"
    }else{
      newStatus = "active"
    }
    await User.findByIdAndUpdate(id, {status: newStatus}, {new: true});
    res.status(200).json({
      message: "Updated Successfully"
    })
  },
  getAllUser: async (req, res) => {
    const {page, size} = req.query;
    let users;
    if(page || size){
      users = await User.find().limit(parseInt(size)).skip(parseInt(size)*parseInt(page)).select({
        password: 0,
        agreeWithCondition: 0,
        __v: 0,
      });
    }else{
      users = await User.find().select({
        password: 0,
        agreeWithCondition: 0,
        __v: 0,
      });
    }
    res.status(200).json({ users });
  },
  updateUser: async (req, res) => {},
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.status(200).json({
        message: "Member Delete Successfully!",
      });
    } catch (err) {
      res.status(500).json({
        message: "Server Side Error!",
      });
      console.log(err);
    }
  },
};
