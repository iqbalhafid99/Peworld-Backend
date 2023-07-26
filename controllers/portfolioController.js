const portfolioModel = require("../models/portfolioModel");
const response = require("../helper/response");
const jwt = require("jsonwebtoken");
const cloudinary = require("../middleware/cloudinary");
const dataToken = process.env.JWT_SECRET;

const portfolioController = {
  addPortfolio: async (req, res) => {
    const { aplikasi, repo, type } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Mengambil token dari header
    const image = await cloudinary.uploader.upload(req.file.path);
    if (!token) {
      return response(401, 0, "Token not found", res);
    }
    const decoded = jwt.verify(token, dataToken);

    const user_id = decoded.id;
    const data = {
      user_id,
      aplikasi,
      repo,
      type,
      image: image.url,
    };

    portfolioModel
      .addPortfolio({ data }) // Kirimkan objek data sebagai parameter
      .then((result) => {
        console.log(data);
        response(
          200,
          result.rowCount,
          "berhasil menambahkan pengalaman kerja",
          res
        );
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getPortoByID: (req, res) => {
    const id = req.params.id;
    portfolioModel
      .selectByID(id)
      .then((result) => {
        response(200, result.rows, "list Portofolio!", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  destroyPorto: (req, res) => {
    const { id } = req.params;
    portfolioModel
      .destroyData(id)
      .then((result) => {
        if (result.rowCount > 0) {
          response(
            200,
            result.rowCount,
            "Portofolio successfully deleted!",
            res
          );
        } else {
          response(404, 0, "Porto not found!", res);
        }
      })
      .catch((err) => {
        console.log(err);
        response(500, 0, "Internal server error", res);
      });
  },
};

module.exports = portfolioController;
