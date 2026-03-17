const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  toggleVerify
} = require("../controllers/usersController");

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);
router.put("/verify/:id", toggleVerify);

module.exports = router;