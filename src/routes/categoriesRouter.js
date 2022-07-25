import { getCategories, addCategory } from "../controllers/categoriesController.js";
import { ValidateCategory } from "../middlewares/categoriesValidationMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", ValidateCategory, addCategory);

export default router;