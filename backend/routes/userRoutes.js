import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getAllUsers,
  deleteUser
} from "../controllers/userController.js";
import { securedAuth, adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(securedAuth, adminAuth, getAllUsers);
router.post("/login", authUser);
router
  .route("/profile")
  .get(securedAuth, getUserProfile)
  .put(securedAuth, updateUserProfile);

router.route("/:id").delete(securedAuth, adminAuth, deleteUser)
export default router;
