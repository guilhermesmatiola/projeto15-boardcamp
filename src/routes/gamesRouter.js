import { getGames, addGame } from "../controllers/gamesController.js";
import { ValidateGame } from "../middlewares/gamesValidationMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/games", getGames);
router.post("/games", ValidateGame, addGame);

export default router;