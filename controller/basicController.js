const Academi = require("../model/academiModel");

module.exports = {
  allAcademi: async (req, res) => {
    const academiList = await Academi.find({});
    res.status(200).json(academiList);
  },
  createAcademi: async (req, res) => {
    const academi = await Academi.create(req.body);
    res.status(201).json({
      message: "Academi Added Successfully",
    });
  },
  academiById: async (req, res) => {},
  deleteAcademi: async (req, res) => {
    try {
      const { id } = req.params;
      await Academi.findByIdAndDelete(id);
      res.status(200).json({
        message: "deleted successfully!"
      })
    } catch (err) {
      console.log(err);
      res.status(500).json("Internal Server Error!");
    }
  },
};
