import { getRentals, addRental, finishRental, deleteRental, } from "../controllers/rentalsController.js";
  import { ValidateRental } from "../middlewares/rentalsSchemaValidationMiddleware.js";
  import { Router } from "express";
  
  const router = Router();
  
  router.get("/rentals", getRentals);
  router.post("/rentals", ValidateRental, addRental);
  router.post("/rentals/:id/return", ValidateRental, finishRental);
  router.delete("/rentals/:id", deleteRental);
  
  export default router;