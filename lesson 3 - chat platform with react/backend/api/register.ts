import { Router } from "express";

const router = Router();

router.post('/', registerHandler);

export default router;