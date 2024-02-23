const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, "./assets/files");
    } else {
      cb(null, "./assets/images");
    }
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    let userId;
    if (file.mimetype === "application/pdf"){
        userId = req.params.id;
    }else{
        userId = req.user.id
    }
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      userId;
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
        cb(new Error(" jpg, jpeg, png, pdf format allowed only!"));
    }
  },
});

module.exports = upload;
