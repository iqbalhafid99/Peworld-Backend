const db = require("../config/db");

const portfolioModel = {
  // add skill
  addPortfolio: ({ data }) => {
    const { aplikasi, repo, type, image, user_id } = data;
    const sql = `INSERT INTO public.portofolio(aplikasi, repo, type, image, user_id) VALUES ('${aplikasi}','${repo}','${type}','${image}',${user_id});`;

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
        `SELECT * FROM portofolio WHERE user_id=${user_id}`,
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
    const sql = `DELETE FROM portofolio WHERE id=${id}`;
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

module.exports = portfolioModel;
