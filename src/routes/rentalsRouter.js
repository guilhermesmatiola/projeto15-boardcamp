import { getRentals, addRental, finishRental, deleteRental } from "../controllers/rentalsController.js";
import { ValidateDeleteRental, ValidateFinishRental, ValidateRental } from "../middlewares/rentalsValidationMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", ValidateRental, addRental);
router.post("/rentals/:id/return", ValidateFinishRental, finishRental);
router.delete("/rentals/:id", ValidateDeleteRental, deleteRental);

export default router;