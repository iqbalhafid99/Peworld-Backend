const db = require("../config/db");

const skillsModel = {
  // add skill
  addSkills: ({ data }) => {
    const { skills, user_id } = data;
    const sql = `INSERT INTO public.keahlian(
         skills, user_id)
        VALUES ('${skills}',${user_id});`;

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
        `SELECT * FROM keahlian WHERE user_id=${user_id}`,
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
    const sql = `DELETE FROM keahlian WHERE id=${id}`;
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

module.exports = skillsModel;
