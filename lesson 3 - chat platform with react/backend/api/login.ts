import { Router } from "express";
import loginHandler from "../middleware/loginHandler";

const router = Router();

router.post('/', loginHandler);

export default router;