const userModel = require("../models/userModel");
const response = require("../helper/response");
const bcrypt = require("bcrypt");
const jwtToken = require("../helper/jwt");
const jwt = require("jsonwebtoken");
const dataToken = process.env.JWT_SECRET;
const cloudinary = require("../middleware/cloudinary");

const userCotroller = {
  // Select All Users
  getUser: (req, res) => {
    userModel
      .selectAll()
      .then((result) => {
        response(200, result.rows, "List All User", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  //   input Users || register users

  register: (req, res) => {
    const { name, email, handphone, password } = req.body;

    userModel
      .getUserByEmail(email)
      .then((existingUser) => {
        if (existingUser) {
          response(400, null, "Email sudah terdaftar!", res);
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            const data = {
              name,
              email,
              handphone,
              password: hash,
            };
            userModel
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
  login: async (req, res) => {
    const { email, password } = req.body;
    const data = {
      email,
      password,
    };
    userModel
      .login(data)
      .then((result) => {
        if (result.rowCount > 0) {
          const id = result.rows[0].id;
          const email = result.rows[0].email;
          const name = result.rows[0].name;
          const admin = result.rows[0].admin;
          const handphone = result.rows[0].handphone;
          const image = result.rows[0].image;
          const jobdesk = result.rows[0].jobdesk;
          const domisili = result.rows[0].domisili;
          const tempat_kerja = result.rows[0].deskripsi;
          bcrypt
            .compare(password, result.rows[0].password)
            .then(async (result) => {
              if (result === true) {
                const token = await jwtToken({
                  email,
                  id,
                  name,
                  handphone,
                  image,
                  jobdesk,
                  domisili,
                  tempat_kerja,
                  admin,
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
  getUserFromToken: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1]; // Mengambil token dari header

      if (!token) {
        return response(401, 0, "Token not found", res);
      }

      const decoded = jwt.verify(token, dataToken);

      const id = decoded.id;
      const name = decoded.name;
      const admin = decoded.admin;
      const image = decoded.image;
      const handphone = decoded.handphone;
      const jobdesk = decoded.jobdesk;
      const domisili = decoded.domisili;
      const tempat_kerja = decoded.tempat_kerja;

      return res.status(200).json({
        success: true,
        message: "Sukses mendapatkan data",
        id,
        name,
        admin,
        image,
        handphone,
        jobdesk,
        domisili,
        tempat_kerja,
      });
    } catch (err) {
      console.log(err);
      response(400, 0, err, res);
    }
  },

  // edit profile
  editProfile: (req, res) => {
    const { id } = req.params;
    const { name, jobdesk, domisili, tempat_kerja, deskripsi } = req.body;
    const data = {
      name,
      jobdesk,
      domisili,
      tempat_kerja,
      deskripsi,
    };
    userModel
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

  editImage: async (req, res) => {
    const { id } = req.params;
    const image = await cloudinary.uploader.upload(req.file.path);

    userModel
      .editImage(id, image.secure_url)
      .then((result) => {
        console.log(result);
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

  // get profile by id
  getByID: (req, res) => {
    const id = req.params.id;
    userModel
      .selectByID(id)
      .then((result) => {
        response(200, result.rows, "list profile!", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // paginasi
  paginate: async (req, res) => {
    const { limit, page, sort } = req.query;
    const pageValue = page ? Number(page) : 1;
    const limitValue = limit ? Number(limit) : 5;
    const offsetValue = pageValue === 1 ? 0 : (pageValue - 1) * limitValue;

    try {
      const foods = await userModel.paginate(limitValue, offsetValue, sort);
      const pagination = {
        currentPage: pageValue,
        dataPerPage: limitValue,
      };
      res.status(200).json({
        foods,
        pagination,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to fetch users",
      });
    }
  },

  // search
  search: (req, res) => {
    const { query } = req.query;
    const searchQuery = `%${query.toLowerCase()}%`;

    userModel
      .search(searchQuery)
      .then((result) => {
        response(200, result.rows, "Search Results!", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // sorting user by asc or desc
  sortUser: (req, res) => {
    let { sort } = req.query;
    sort = sort === "desc" ? "DESC" : "ASC"; // Menentukan urutan default jika sort tidak valid

    const columnName = "name";

    userModel
      .sortUsers(columnName, sort)
      .then((result) => {
        response(200, result.rows, "Sorted user List!", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

module.exports = userCotroller;
