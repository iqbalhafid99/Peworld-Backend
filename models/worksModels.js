const db = require("../config/db");

const worksModel = {
  // add skill
  addWorks: ({ data }) => {
    const { posisi, perusahaan, tanggal, deskripsi, user_id } = data;
    const sql = `INSERT INTO public.pengalaman_kerja(
         posisi, perusahaan, tanggal, deskripsi, user_id)
        VALUES ('${posisi}','${perusahaan}','${tanggal}','${deskripsi}',${user_id});`;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  selectByID: (user_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM pengalaman_kerja WHERE user_id=${user_id}`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },

  destroyData: (id) => {
    const sql = `DELETE FROM pengalaman_kerja WHERE id=${id}`;
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

module.exports = worksModel;
