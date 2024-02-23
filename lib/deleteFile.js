const path = require("path");
const fs = require("fs");

module.exports = () => {
  const filePath = path.join(__dirname, "assets", req.file.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting uploaded file:", err);
    } else {
      console.log("Uploaded file deleted successfully");
    }
  });
};
