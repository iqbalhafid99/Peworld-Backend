const express = require("express");
const router = express.Router();

const {
  getUser,
  register,
  login,
  getUserFromToken,
  editProfile,
  getByID,
  editImage,
  paginate,
  search,
  sortUser,
} = require("../controllers/userController");

const {
  addWorks,
  destroyWorks,
  getWorksByID,
} = require("../controllers/worksController");

const {
  addSkills,
  getSkillsByID,
  destroySkill,
} = require("../controllers/skillsController");

const {
  addPortfolio,
  getPortoByID,
  destroyPorto,
} = require("../controllers/portfolioController");
const upload = require("../middleware/multer");

router.get("/user", getUser);
router.get("/user/:id", getByID);
router.post("/register", register);
router.post("/login", login);
router.put("/editprofile/:id", editProfile);
router.get("/credential", getUserFromToken);
router.put("/photo/:id", upload, editImage);
router.get("/pagination", paginate);
router.get("/search", search);
router.get("/sort", sortUser);

// add portfolio
router.post("/add-works", addWorks);
router.get("/works/:id", getWorksByID);
router.delete("/works/:id", destroyWorks);

// portofolio
router.post("/add-portfolio", upload, addPortfolio);
router.get("/porto/:id", getPortoByID);
router.delete("/porto/:id", destroyPorto);

// skills
router.post("/add-skills", addSkills);
router.get("/skills/:id", getSkillsByID);
router.delete("/skills/:id", destroySkill);

// admin
const {
  getUserAdmin,
  registerAdmin,
  loginAdmin,
  getByIDAdmin,
  getAdminFromToken,
  editProfileAdmin,
  editImageAdmin,
} = require("../controllers/adminController");

router.post("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);
router.get("/admin", getUserAdmin);
router.get("/admin/:id", getByIDAdmin);
router.put("/admin/:id", editProfileAdmin);
router.put("/admin-photo/:id", upload, editImageAdmin);
router.get("/credential-admin", getAdminFromToken);

module.exports = router;
