const worksModel = require("../models/worksModels");
const response = require("../helper/response");
const jwt = require("jsonwebtoken");
const dataToken = process.env.JWT_SECRET;

const worksController = {
  addWorks: async (req, res) => {
    const { posisi, perusahaan, tanggal, deskripsi } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Mengambil token dari header

    if (!token) {
      return response(401, 0, "Token not found", res);
    }
    const decoded = jwt.verify(token, dataToken);

    const user_id = decoded.id;
    const data = {
      user_id,
      posisi,
      perusahaan,
      tanggal,
      deskripsi,
    };

    worksModel
      .addWorks({ data }) // Kirimkan objek data sebagai parameter
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

  getWorksByID: (req, res) => {
    const id = req.params.id;
    worksModel
      .selectByID(id)
      .then((result) => {
        response(200, result.rows, "list pengalaman kerja!", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  destroyWorks: (req, res) => {
    const { id } = req.params;
    worksModel
      .destroyData(id)
      .then((result) => {
        if (result.rowCount > 0) {
          response(
            200,
            result.rowCount,
            "Pengalaman kerja successfully deleted!",
            res
          );
        } else {
          response(404, 0, "pengalaman kerja not found!", res);
        }
      })
      .catch((err) => {
        console.log(err);
        response(500, 0, "Internal server error", res);
      });
  },
};

module.exports = worksController;
