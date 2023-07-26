const adminModel = require("../models/adminModel");
const response = require("../helper/response");
const bcrypt = require("bcrypt");
const jwtToken = require("../helper/jwt");
const jwt = require("jsonwebtoken");
const dataToken = process.env.JWT_SECRET;
const cloudinary = require("../middleware/cloudinary");

const adminController = {
  // Select All Users
  getUserAdmin: (req, res) => {
    adminModel
      .selectAll()
      .then((result) => {
        response(200, result.rows, "List All User", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  //   input Users || register users

  registerAdmin: (req, res) => {
    const { nama, email, perusahaan, jabatan, hp, password } = req.body;

    adminModel
      .getUserByEmail(email)
      .then((existingUser) => {
        if (existingUser) {
          response(400, null, "Email sudah terdaftar!", res);
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            const data = {
              nama,
              email,
              perusahaan,
              jabatan,
              hp,
              password: hash,
            };
            adminModel
              .register(data)
              .then((result) => {
                response(200, result.rowCount, "Registrasi berhasil!", res);
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        response(500, null, "Terjadi kesalahan server!", res);
      });
  },

  // login user
  loginAdmin: async (req, res) => {
    const { email, password } = req.body;
    const data = {
      email,
      password,
    };
    adminModel
      .login(data)
      .then((result) => {
        if (result.rowCount > 0) {
          const id = result.rows[0].id;
          bcrypt
            .compare(password, result.rows[0].password)
            .then(async (result) => {
              if (result === true) {
                const token = await jwtToken({
                  id,
                });
                return res
                  .status(200)
                  .set("Authorization", `Bearer ${token}`) // Simpan token di header
                  .json({
                    success: true,
                    message: "Login successful",
                    token,
                  });
              } else {
                response(400, result.rowCount, "Password salah", res);
              }
            });
        } else {
          response(400, result.rowCount, "Email atau username salah", res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // mendapatkan kredensial token user
  // get credentials user profile
  getAdminFromToken: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1]; // Mengambil token dari header

      if (!token) {
        return response(401, 0, "Token not found", res);
      }

      const decoded = jwt.verify(token, dataToken);

      const id = decoded.id;

      return res.status(200).json({
        success: true,
        message: "Sukses mendapatkan data",
        id,
      });
    } catch (err) {
      console.log(err);
      response(400, 0, err, res);
    }
  },

  // edit profile
  editProfileAdmin: (req, res) => {
    const { id } = req.params;
    const { nama, bidang, kota, email, deskripsi, ig, hp, linkedin } = req.body;
    const data = {
      nama,
      bidang,
      kota,
      email,
      deskripsi,
      ig,
      hp,
      linkedin,
    };
    adminModel
      .editProfile(id, data)
      .then((result) => {
        if (result.rowCount > 0) {
          response(
            200,
            result.rowCount,
            "Data diri berhasil ditambahkan!",
            res
          );
        } else {
          response(404, 0, "data tidak ada", res);
        }
      })
      .catch((err) => {
        console.log(err);
        response(500, 0, "Internal server error", res);
      });
  },

  editImageAdmin: async (req, res) => {
    const { id } = req.params;
    const image = await cloudinary.uploader.upload(req.file.path);

    adminModel
      .editImage(id, image.secure_url)
      .then((result) => {
        console.log(result);
        response(200, result.rowCount, "berhasil mengubah foto profile", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // get profile by id
  getByIDAdmin: (req, res) => {
    const id = req.params.id;
    adminModel
      .selectByID(id)
      .then((result) => {
        response(200, result.rows, "list profile!", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

module.exports = adminController;
