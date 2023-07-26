const db = require("../config/db");

const adminModel = {
  // SQL to select All admin
  selectAll: () => {
    const sql = `SELECT * FROM public."admin"`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  //   SQL to input admin
  register: ({ nama, email, perusahaan, jabatan, hp, password }) => {
    const sql = `INSERT INTO admin (nama, email, perusahaan, jabatan, hp, password) VALUES ('${nama}','${email}','${perusahaan}','${jabatan}','${hp}','${password}')`;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  editProfile: (id, data) => {
    const { nama, bidang, kota, email, deskripsi, ig, hp, linkedin } = data;
    const sql = `UPDATE admin SET nama = '${nama}', bidang = '${bidang}', kota = '${kota}', email = '${email}', deskripsi = '${deskripsi}', ig = '${ig}', hp = '${hp}', linkedin = '${linkedin}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

  editImage: (id, image) => {
    const sql = `UPDATE admin SET image = '${image}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

  //   SQL untuk validasi ketika email sama
  getUserByEmail: (email) => {
    const sql = `SELECT * FROM admin WHERE email = '${email}'`;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.rows.length === 0 ? null : result.rows[0]);
      });
    });
  },

  // SQL from login
  login: ({ email }) => {
    const sql = `SELECT * FROM admin WHERE email = '${email}'`;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // get profile by id
  selectByID: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM admin WHERE id=${id}`, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },
};

module.exports = adminModel;
