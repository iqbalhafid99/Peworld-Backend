const db = require("../config/db");

const userModel = {
  // SQL to select All Users
  selectAll: () => {
    const sql = `SELECT * FROM public."users"`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  //   SQL to input users
  register: ({ name, email, handphone, password }) => {
    const sql = `INSERT INTO users (name, email, handphone, password) VALUES ('${name}','${email}','${handphone}','${password}')`;

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
    const { name, jobdesk, domisili, tempat_kerja, deskripsi } = data;
    const sql = `UPDATE users SET name = '${name}', jobdesk = '${jobdesk}', domisili = '${domisili}', tempat_kerja = '${tempat_kerja}', deskripsi = '${deskripsi}' WHERE id = ${id}`;
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
    const sql = `UPDATE users SET image = '${image}' WHERE id = ${id}`;
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
    const sql = `SELECT * FROM users WHERE email = '${email}'`;

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
    const sql = `SELECT * FROM users WHERE email = '${email}'`;

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
      db.query(`SELECT * FROM users WHERE id=${id}`, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

  // paginasi
  paginate: (limit, offset, sort) => {
    return new Promise((resolve, reject) => {
      const order = sort === "desc" ? "DESC" : "ASC"; // Menentukan urutan sorting berdasarkan nilai sort

      const sql = `SELECT * FROM users ORDER BY name ${order} LIMIT ${limit} OFFSET ${offset}`;

      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

  // search
  search: (query) => {
    const sql = `SELECT * FROM users WHERE LOWER(name) LIKE $1`;
    return new Promise((resolve, reject) => {
      db.query(sql, [query], (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

  // sort
  sortUsers: (name, sortOrder) => {
    const sql = `SELECT * FROM users ORDER BY ${name} ${sortOrder}`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },
};

module.exports = userModel;
