import { Router } from "express";
import authenticateToken from "../middleware/authHandler";
import { RequestRouter } from "../types/requests";

const router = Router();

router.get('/me', authenticateToken, (req: RequestRouter, res) => {
    const userProfile = {
        id: req.user!.id,
        username: req.user!.username,
        created_at: req.user!.created_at,
    };

    return res
        .status(200)
        .type("application/json")
        .json({
            code: 200,
            message: "User is onlinned!",
            user: userProfile
        });
});

export default router;