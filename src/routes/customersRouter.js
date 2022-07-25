import { getCustomers, getCustomer, addCustomer, updateCustomer } from "../controllers/customersController.js";
import { ValidateCustomer, ValidateGetCustomer } from "../middlewares/customersValidationMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", ValidateGetCustomer, getCustomer);
router.post("/customers", ValidateCustomer, addCustomer);
router.put("/customers/:id", ValidateCustomer, updateCustomer);

export default router;