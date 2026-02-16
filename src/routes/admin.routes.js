import express from "express";
import {
  adminLogin,
  adminLogout,
  createAdminByAdmin,
  getAllAdmins,
  deleteAdmin,
  createAdmin,
  getAllUser,
  editAdmin,
} from "../controllers/admin.controller.js";
import { adminAuth, superAdminAuth } from "../middleware/index.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);

router.post("/create-api", createAdmin);
router.post("/create", superAdminAuth, createAdminByAdmin);
router.get("/list", adminAuth, getAllAdmins);
router.delete("/:adminId", superAdminAuth, deleteAdmin);
router.put("/:adminId", superAdminAuth, editAdmin)
router.get("/allUser", adminAuth, getAllUser)
export default router;
