import { Router } from "express";
import { specialtyRoutes } from "../modules/specialty/specialty.routes";
import { authRoutes } from "../modules/auth/auth.routes";

const router = Router();

router.use("/specialties", specialtyRoutes);
router.use("/auth", authRoutes);

export const indexRoutes = router;
