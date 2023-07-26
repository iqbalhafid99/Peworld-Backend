const skillsModel = require("../models/skillsModel");
const response = require("../helper/response");
const jwt = require("jsonwebtoken");
const dataToken = process.env.JWT_SECRET;

const skillsController = {
  addSkills: async (req, res) => {
    const { skills } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Mengambil token dari header

    if (!token) {
      return response(401, 0, "Token not found", res);
    }
    const decoded = jwt.verify(token, dataToken);

    const user_id = decoded.id;
    const data = {
      user_id,
      skills,
    };

    skillsModel
      .addSkills({ data }) // Kirimkan objek data sebagai parameter
      .then((result) => {
        response(200, result.rowCount, "berhasil menambahkan skills", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getSkillsByID: (req, res) => {
    const id = req.params.id;
    skillsModel
      .selectByID(id)
      .then((result) => {
        response(200, result.rows, "list profile!", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  destroySkill: (req, res) => {
    const { id } = req.params;
    skillsModel
      .destroyData(id)
      .then((result) => {
        if (result.rowCount > 0) {
          response(200, result.rowCount, "Skills successfully deleted!", res);
        } else {
          response(404, 0, "Recipe not found!", res);
        }
      })
      .catch((err) => {
        console.log(err);
        response(500, 0, "Internal server error", res);
      });
  },
};

module.exports = skillsController;
