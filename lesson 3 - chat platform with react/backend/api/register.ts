import { Router } from "express";
import registerHandler from "../middleware/registerHandler";

const router = Router();

router.post('/', registerHandler);

export default router;