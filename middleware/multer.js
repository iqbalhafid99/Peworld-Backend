const multer = require("multer");
const path = require("path");

// management file

const multerUpload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `/${Date.now()}${ext}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext === ".jpg" || ext === ".png" || ext === ".jpeg") {
      cb(null, true);
    } else {
      const error = {
        message: "gambar harus png atau jpg dan jpeg",
      };
      cb(error, false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const upload = (req, res, next) => {
  const multerSingle = multerUpload.single("image");
  multerSingle(req, res, (err) => {
    if (err) {
      res.json({
        message: "error when upload file",
        err,
      });
    } else {
      next();
    }
  });
};

module.exports = upload;
